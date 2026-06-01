import './webauthn-webcrypto';

import { createHmac, timingSafeEqual } from 'node:crypto';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import { v7 as uuidv7 } from 'uuid';
import { z } from 'zod';
import { createSql, ensureAdminSchema, ensureBootstrapInvite, type AdminUser } from './db';
import { loadConfig } from './config';
import { createInviteJwt, sha256Base64Url, verifyInviteJwt } from './jwt';

type RegistrationResponseJSON = any;
type AuthenticationResponseJSON = any;

const config = loadConfig();
const sql = createSql(config);
const app = new Hono<{ Variables: { admin: AdminUser } }>();
const SESSION_COOKIE = 'mini_dice_admin_session';
const SESSION_MAX_AGE_SECONDS = 12 * 60 * 60;

function signCookieValue(value: string) {
  return createHmac('sha256', config.cookieSecret).update(value).digest('base64url');
}

function encodeSessionCookie(sessionId: string) {
  return `${sessionId}.${signCookieValue(sessionId)}`;
}

function decodeSessionCookie(value?: string) {
  if (!value) return null;
  const [sessionId, signature] = value.split('.');
  if (!sessionId || !signature) return null;
  const expected = signCookieValue(sessionId);
  if (signature.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }
  return sessionId;
}

function setAdminSessionCookie(c: Parameters<typeof setCookie>[0], sessionId: string, expiresAt: Date) {
  setCookie(c, SESSION_COOKIE, encodeSessionCookie(sessionId), {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: 'Lax',
    path: '/',
    expires: expiresAt,
  });
}

function clearAdminSessionCookie(c: Parameters<typeof deleteCookie>[0]) {
  deleteCookie(c, SESSION_COOKIE, { path: '/' });
}

async function jsonBody<T>(c: any, schema: z.ZodSchema<T>): Promise<T> {
  const body = await c.req.json().catch(() => ({}));
  return schema.parse(body);
}

function assertAdmin(admin?: AdminUser) {
  if (!admin) {
    throw new HTTPException(401, { message: '관리자 로그인이 필요합니다.' });
  }
  if (admin.isDisabled) {
    throw new HTTPException(403, { message: '비활성화된 관리자 계정입니다.' });
  }
}

async function authMiddleware(c: any, next: () => Promise<void>) {
  const sessionId = decodeSessionCookie(getCookie(c, SESSION_COOKIE));
  if (!sessionId) {
    throw new HTTPException(401, { message: '관리자 로그인이 필요합니다.' });
  }
  const rows = await sql<AdminUser[]>`
    SELECT
      u.id,
      u."displayName",
      u.role,
      u."isDisabled"
    FROM tb_admin_session s
    JOIN tb_admin_user u ON u.id = s."adminUserId"
    WHERE s.id = ${sessionId}
      AND s."revokedAt" IS NULL
      AND s."expiresAt" > NOW()
    LIMIT 1
  `;
  const admin = rows[0];
  assertAdmin(admin);
  await sql`UPDATE tb_admin_session SET "lastSeenAt" = NOW() WHERE id = ${sessionId}`;
  c.set('admin', admin);
  await next();
}

async function createSession(c: any, adminUserId: string) {
  const sessionId = uuidv7();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
  await sql`
    INSERT INTO tb_admin_session (id, "adminUserId", "expiresAt")
    VALUES (${sessionId}, ${adminUserId}, ${expiresAt})
  `;
  setAdminSessionCookie(c, sessionId, expiresAt);
  return sessionId;
}

async function getInviteForToken(inviteToken: string) {
  const payload = verifyInviteJwt(inviteToken, config.jwtSecret);
  const rows = await sql`
    SELECT id, "expiresAt"
    FROM tb_admin_invite
    WHERE "jtiHash" = ${sha256Base64Url(payload.jti)}
      AND "tokenHash" = ${sha256Base64Url(inviteToken)}
      AND "usedAt" IS NULL
      AND "revokedAt" IS NULL
      AND "expiresAt" > NOW()
    LIMIT 1
  `;
  if (!rows[0]) {
    throw new HTTPException(400, { message: '초대 코드가 만료되었거나 사용할 수 없습니다.' });
  }
  return rows[0] as { id: string; expiresAt: Date };
}

async function refreshActivityAggregates(from: Date, to: Date) {
  await sql.begin(async (tx) => {
    await tx`
      INSERT INTO tb_admin_activity_hourly (
        "hourBucket", "activityCount", "activeUserCount", "skillLogCount", "updatedAt"
      )
      WITH ua AS (
        SELECT
          date_trunc('hour', "createdAt") AS hour_bucket,
          COUNT(*)::int AS activity_count,
          COUNT(DISTINCT "userId")::int AS active_user_count
        FROM tb_user_activity
        WHERE "createdAt" >= ${from} AND "createdAt" < ${to}
        GROUP BY 1
      ),
      sl AS (
        SELECT
          date_trunc('hour', "createdAt") AS hour_bucket,
          COUNT(*)::int AS skill_log_count
        FROM tb_skill_log
        WHERE "createdAt" >= ${from} AND "createdAt" < ${to}
        GROUP BY 1
      ),
      hours AS (
        SELECT hour_bucket FROM ua
        UNION
        SELECT hour_bucket FROM sl
      )
      SELECT
        hours.hour_bucket,
        COALESCE(ua.activity_count, 0),
        COALESCE(ua.active_user_count, 0),
        COALESCE(sl.skill_log_count, 0),
        NOW()
      FROM hours
      LEFT JOIN ua ON ua.hour_bucket = hours.hour_bucket
      LEFT JOIN sl ON sl.hour_bucket = hours.hour_bucket
      ON CONFLICT ("hourBucket") DO UPDATE SET
        "activityCount" = EXCLUDED."activityCount",
        "activeUserCount" = EXCLUDED."activeUserCount",
        "skillLogCount" = EXCLUDED."skillLogCount",
        "updatedAt" = NOW()
    `;

    await tx`
      INSERT INTO tb_admin_join_hourly (
        "hourBucket", "authProvider", "countryCode3", "joinCount", "updatedAt"
      )
      SELECT
        date_trunc('hour', "createdAt") AS hour_bucket,
        COALESCE("authProvider", 'unknown') AS auth_provider,
        COALESCE("countryCode3", 'UNK') AS country_code3,
        COUNT(*)::int AS join_count,
        NOW()
      FROM tb_user
      WHERE "createdAt" >= ${from} AND "createdAt" < ${to}
      GROUP BY 1, 2, 3
      ON CONFLICT ("hourBucket", "authProvider", "countryCode3") DO UPDATE SET
        "joinCount" = EXCLUDED."joinCount",
        "updatedAt" = NOW()
    `;

    await tx`
      INSERT INTO tb_admin_comment_hourly (
        "hourBucket", "commentCount", "commentingUserCount", "updatedAt"
      )
      SELECT
        date_trunc('hour', "createdAt") AS hour_bucket,
        COUNT(*)::int AS comment_count,
        COUNT(DISTINCT "userId")::int AS commenting_user_count,
        NOW()
      FROM tb_user_land_comment
      WHERE "createdAt" >= ${from} AND "createdAt" < ${to}
      GROUP BY 1
      ON CONFLICT ("hourBucket") DO UPDATE SET
        "commentCount" = EXCLUDED."commentCount",
        "commentingUserCount" = EXCLUDED."commentingUserCount",
        "updatedAt" = NOW()
    `;

    await tx`
      INSERT INTO tb_admin_user_streak_daily (
        day, "userId", "activityCount", "skillLogCount", "updatedAt"
      )
      WITH source AS (
        SELECT
          "createdAt"::date AS day,
          "userId",
          COUNT(*)::int AS activity_count,
          0::int AS skill_log_count
        FROM tb_user_activity
        WHERE "createdAt" >= ${from} AND "createdAt" < ${to}
        GROUP BY 1, 2
        UNION ALL
        SELECT
          "createdAt"::date AS day,
          "userId",
          0::int AS activity_count,
          COUNT(*)::int AS skill_log_count
        FROM tb_skill_log
        WHERE "createdAt" >= ${from} AND "createdAt" < ${to}
        GROUP BY 1, 2
      )
      SELECT day, "userId", SUM(activity_count)::int, SUM(skill_log_count)::int, NOW()
      FROM source
      GROUP BY day, "userId"
      ON CONFLICT (day, "userId") DO UPDATE SET
        "activityCount" = EXCLUDED."activityCount",
        "skillLogCount" = EXCLUDED."skillLogCount",
        "updatedAt" = NOW()
    `;

    await tx`
      INSERT INTO tb_admin_analytics_refresh_state (
        "aggregateName", "lastSourceAt", "lastRefreshedAt"
      )
      VALUES ('admin-dashboard', ${to}, NOW())
      ON CONFLICT ("aggregateName") DO UPDATE SET
        "lastSourceAt" = EXCLUDED."lastSourceAt",
        "lastRefreshedAt" = NOW()
    `;
  });
}

async function incrementalRefreshRange() {
  const rows = await sql`
    SELECT "lastSourceAt" FROM tb_admin_analytics_refresh_state
    WHERE "aggregateName" = 'admin-dashboard'
  `;
  const fallback = await sql`
    SELECT LEAST(
      COALESCE((SELECT MIN("createdAt") FROM tb_user_activity), NOW()),
      COALESCE((SELECT MIN("createdAt") FROM tb_skill_log), NOW()),
      COALESCE((SELECT MIN("createdAt") FROM tb_user), NOW()),
      COALESCE((SELECT MIN("createdAt") FROM tb_user_land_comment), NOW())
    ) AS since
  `;
  const since = rows[0]?.lastSourceAt
    ? new Date(new Date(rows[0].lastSourceAt).getTime() - 60 * 60 * 1000)
    : new Date(fallback[0].since);
  return { from: since, to: new Date() };
}

app.use(
  '*',
  cors({
    origin: config.adminWebUrl,
    credentials: true,
    allowHeaders: ['Content-Type'],
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);

app.onError((err, c) => {
  if (err instanceof z.ZodError) {
    return c.json({ message: '요청 값이 올바르지 않습니다.', issues: err.issues }, 400);
  }
  if (err instanceof HTTPException) {
    return c.json({ message: err.message }, err.status);
  }
  console.error(err);
  return c.json({ message: '관리자 서버 오류가 발생했습니다.' }, 500);
});

app.get('/health', (c) => c.json({ ok: true }));

app.get('/admin/me', authMiddleware, (c) => c.json({ admin: c.get('admin') }));

app.post('/admin/auth/join/options', async (c) => {
  const body = await jsonBody(
    c,
    z.object({
      inviteToken: z.string().min(20),
      displayName: z.string().min(2).max(120),
    }),
  );
  const invite = await getInviteForToken(body.inviteToken);
  const adminUserId = uuidv7();
  const options = await generateRegistrationOptions({
    rpID: config.webauthnRpId,
    rpName: config.webauthnRpName,
    userID: new Uint8Array(Buffer.from(adminUserId)),
    userName: body.displayName,
    userDisplayName: body.displayName,
    authenticatorSelection: {
      residentKey: 'required',
      requireResidentKey: true,
      userVerification: 'preferred',
    },
  });
  const challengeId = uuidv7();
  await sql`
    INSERT INTO tb_admin_webauthn_challenge (
      id, type, challenge, "inviteId", metadata, "expiresAt"
    ) VALUES (
      ${challengeId},
      'join',
      ${options.challenge},
      ${invite.id},
      ${sql.json({ adminUserId, displayName: body.displayName })},
      ${new Date(Date.now() + 5 * 60 * 1000)}
    )
  `;
  return c.json({ ...options, challengeId });
});

app.post('/admin/auth/join/verify', async (c) => {
  const body = await jsonBody(
    c,
    z.object({
      challengeId: z.string().uuid(),
      credential: z.any(),
      passkeyName: z.string().max(120).optional(),
    }),
  );
  const challengeRows = await sql`
    SELECT id, challenge, "inviteId", metadata
    FROM tb_admin_webauthn_challenge
    WHERE id = ${body.challengeId}
      AND type = 'join'
      AND "expiresAt" > NOW()
    LIMIT 1
  `;
  const challenge = challengeRows[0];
  if (!challenge) {
    throw new HTTPException(400, { message: '패스키 등록 요청이 만료되었습니다.' });
  }

  const verification = await verifyRegistrationResponse({
    response: body.credential as RegistrationResponseJSON,
    expectedChallenge: challenge.challenge,
    expectedOrigin: config.webauthnOrigin,
    expectedRPID: config.webauthnRpId,
    requireUserVerification: false,
  });
  if (!verification.verified || !verification.registrationInfo) {
    throw new HTTPException(400, { message: '관리자 패스키 등록에 실패했습니다.' });
  }

  const metadata = challenge.metadata as { adminUserId: string; displayName: string };
  const registrationInfo = verification.registrationInfo;
  const { credentialID, credentialPublicKey, counter } = registrationInfo;
  await sql.begin(async (tx) => {
    await tx`
      INSERT INTO tb_admin_user (id, "displayName")
      VALUES (${metadata.adminUserId}, ${metadata.displayName})
    `;
    const used = await tx`
      UPDATE tb_admin_invite
      SET "usedAt" = NOW(), "usedByAdminUserId" = ${metadata.adminUserId}
      WHERE id = ${challenge.inviteId}
        AND "usedAt" IS NULL
        AND "revokedAt" IS NULL
        AND "expiresAt" > NOW()
      RETURNING id
    `;
    if (used.length === 0) {
      throw new HTTPException(400, { message: '초대 코드가 이미 사용되었습니다.' });
    }
    await tx`
      INSERT INTO tb_admin_passkey (
        id,
        "adminUserId",
        "credentialId",
        "publicKey",
        counter,
        "deviceType",
        transports,
        name
      ) VALUES (
        ${uuidv7()},
        ${metadata.adminUserId},
        ${typeof credentialID === 'string' ? credentialID : Buffer.from(credentialID).toString('base64url')},
        ${Buffer.from(credentialPublicKey).toString('base64url')},
        ${counter},
        ${registrationInfo.credentialDeviceType},
        ${(body.credential as RegistrationResponseJSON).response.transports?.join(',') ?? null},
        ${body.passkeyName || 'Admin passkey'}
      )
    `;
    await tx`DELETE FROM tb_admin_webauthn_challenge WHERE id = ${body.challengeId}`;
  });
  await createSession(c, metadata.adminUserId);
  return c.json({ success: true });
});

app.post('/admin/auth/login/options', async (c) => {
  const options = await generateAuthenticationOptions({
    rpID: config.webauthnRpId,
    userVerification: 'preferred',
  });
  const challengeId = uuidv7();
  await sql`
    INSERT INTO tb_admin_webauthn_challenge (id, type, challenge, "expiresAt")
    VALUES (${challengeId}, 'login', ${options.challenge}, ${new Date(Date.now() + 5 * 60 * 1000)})
  `;
  return c.json({ ...options, challengeId });
});

app.post('/admin/auth/login/verify', async (c) => {
  const body = await jsonBody(
    c,
    z.object({
      challengeId: z.string().uuid(),
      credential: z.any(),
    }),
  );
  const challengeRows = await sql`
    SELECT id, challenge
    FROM tb_admin_webauthn_challenge
    WHERE id = ${body.challengeId}
      AND type = 'login'
      AND "expiresAt" > NOW()
    LIMIT 1
  `;
  const challenge = challengeRows[0];
  if (!challenge) {
    throw new HTTPException(401, { message: '패스키 로그인 요청이 만료되었습니다.' });
  }
  const credential = body.credential as AuthenticationResponseJSON;
  const passkeys = await sql`
    SELECT p.*, u."isDisabled"
    FROM tb_admin_passkey p
    JOIN tb_admin_user u ON u.id = p."adminUserId"
    WHERE p."credentialId" = ${credential.id}
    LIMIT 1
  `;
  const passkey = passkeys[0];
  if (!passkey || passkey.isDisabled) {
    throw new HTTPException(401, { message: '등록된 관리자 패스키를 찾을 수 없습니다.' });
  }
  const verification = await verifyAuthenticationResponse({
    response: credential,
    expectedChallenge: challenge.challenge,
    expectedOrigin: config.webauthnOrigin,
    expectedRPID: config.webauthnRpId,
    requireUserVerification: false,
    authenticator: {
      credentialID: isoBase64URL.toBuffer(credential.id) as any,
      credentialPublicKey: isoBase64URL.toBuffer(passkey.publicKey) as any,
      counter: passkey.counter,
    },
  });
  if (!verification.verified) {
    throw new HTTPException(401, { message: '관리자 패스키 로그인에 실패했습니다.' });
  }
  await sql`
    UPDATE tb_admin_passkey
    SET counter = ${verification.authenticationInfo.newCounter}, "lastUsedAt" = NOW()
    WHERE id = ${passkey.id}
  `;
  await sql`UPDATE tb_admin_user SET "lastLoginAt" = NOW() WHERE id = ${passkey.adminUserId}`;
  await sql`DELETE FROM tb_admin_webauthn_challenge WHERE id = ${body.challengeId}`;
  await createSession(c, passkey.adminUserId);
  return c.json({ success: true });
});

app.post('/admin/auth/logout', authMiddleware, async (c) => {
  const sessionId = decodeSessionCookie(getCookie(c, SESSION_COOKIE));
  if (sessionId) {
    await sql`UPDATE tb_admin_session SET "revokedAt" = NOW() WHERE id = ${sessionId}`;
  }
  clearAdminSessionCookie(c);
  return c.json({ success: true });
});

app.get('/admin/comments', authMiddleware, async (c) => {
  const q = c.req.query('q')?.trim();
  const page = Math.max(Number(c.req.query('page') ?? 1), 1);
  const limit = Math.min(Math.max(Number(c.req.query('limit') ?? 50), 10), 100);
  const offset = (page - 1) * limit;
  const rows = q
    ? await sql`
        SELECT c.id, c."userId", u.username, c."landId", c.comment, c."createdAt", c."updatedAt"
        FROM tb_user_land_comment c
        JOIN tb_user u ON u."userId" = c."userId"
        WHERE c.comment ILIKE ${`%${q}%`} OR u.username ILIKE ${`%${q}%`}
        ORDER BY c."createdAt" DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    : await sql`
        SELECT c.id, c."userId", u.username, c."landId", c.comment, c."createdAt", c."updatedAt"
        FROM tb_user_land_comment c
        JOIN tb_user u ON u."userId" = c."userId"
        ORDER BY c."createdAt" DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
  return c.json({ items: rows, page, limit });
});

app.patch('/admin/comments/:id', authMiddleware, async (c) => {
  const body = await jsonBody(c, z.object({ comment: z.string().min(1).max(200) }));
  const rows = await sql`
    UPDATE tb_user_land_comment
    SET comment = ${body.comment}, "updatedAt" = NOW()
    WHERE id = ${c.req.param('id')}
    RETURNING id, comment, "updatedAt"
  `;
  if (!rows[0]) throw new HTTPException(404, { message: '댓글을 찾을 수 없습니다.' });
  return c.json({ item: rows[0] });
});

app.delete('/admin/comments/:id', authMiddleware, async (c) => {
  await sql`DELETE FROM tb_user_land_comment WHERE id = ${c.req.param('id')}`;
  return c.json({ success: true });
});

app.get('/admin/activities', authMiddleware, async (c) => {
  const page = Math.max(Number(c.req.query('page') ?? 1), 1);
  const limit = Math.min(Math.max(Number(c.req.query('limit') ?? 50), 10), 100);
  const rows = await sql`
    SELECT a.id, a."userId", u.username, a."skillRoute", a."skillDrawProps", a.read, a."createdAt"
    FROM tb_user_activity a
    JOIN tb_user u ON u."userId" = a."userId"
    ORDER BY a."createdAt" DESC
    LIMIT ${limit} OFFSET ${(page - 1) * limit}
  `;
  return c.json({ items: rows, page, limit });
});

app.get('/admin/users', authMiddleware, async (c) => {
  const q = c.req.query('q')?.trim();
  const page = Math.max(Number(c.req.query('page') ?? 1), 1);
  const limit = Math.min(Math.max(Number(c.req.query('limit') ?? 50), 10), 100);
  const rows = q
    ? await sql`
        SELECT "userId", username, plain_email, "authProvider", "countryCode3", "signupCompleted",
          "isTerminated", cash::text, "createdAt", "updatedAt"
        FROM tb_user
        WHERE username ILIKE ${`%${q}%`} OR plain_email ILIKE ${`%${q}%`}
        ORDER BY "createdAt" DESC
        LIMIT ${limit} OFFSET ${(page - 1) * limit}
      `
    : await sql`
        SELECT "userId", username, plain_email, "authProvider", "countryCode3", "signupCompleted",
          "isTerminated", cash::text, "createdAt", "updatedAt"
        FROM tb_user
        ORDER BY "createdAt" DESC
        LIMIT ${limit} OFFSET ${(page - 1) * limit}
      `;
  return c.json({ items: rows, page, limit });
});

app.get('/admin/users/:id', authMiddleware, async (c) => {
  const rows = await sql`
    SELECT "userId", username, plain_email, "authProvider", "countryCode3", "signupCompleted",
      "isTerminated", "isUserDiceTossForbidden", "canTossDiceAfter", cash::text,
      "createdAt", "updatedAt"
    FROM tb_user
    WHERE "userId" = ${c.req.param('id')}
    LIMIT 1
  `;
  if (!rows[0]) throw new HTTPException(404, { message: '사용자를 찾을 수 없습니다.' });
  return c.json({ item: rows[0] });
});

app.patch('/admin/users/:id', authMiddleware, async (c) => {
  const body = await jsonBody(
    c,
    z.object({
      username: z.string().min(2).max(20).optional(),
      countryCode3: z.string().length(3).optional(),
    }),
  );
  const current = await sql`SELECT username, "countryCode3" FROM tb_user WHERE "userId" = ${c.req.param('id')}`;
  if (!current[0]) throw new HTTPException(404, { message: '사용자를 찾을 수 없습니다.' });
  const rows = await sql`
    UPDATE tb_user
    SET username = ${body.username ?? current[0].username},
        "countryCode3" = ${body.countryCode3 ?? current[0].countryCode3},
        "updatedAt" = NOW()
    WHERE "userId" = ${c.req.param('id')}
    RETURNING "userId", username, "countryCode3", "updatedAt"
  `;
  return c.json({ item: rows[0] });
});

app.post('/admin/users/:id/ban', authMiddleware, async (c) => {
  await sql`
    UPDATE tb_user
    SET "isTerminated" = TRUE,
        "isUserDiceTossForbidden" = TRUE,
        "updatedAt" = NOW()
    WHERE "userId" = ${c.req.param('id')}
  `;
  return c.json({ success: true });
});

app.post('/admin/users/:id/unban', authMiddleware, async (c) => {
  await sql`
    UPDATE tb_user
    SET "isTerminated" = FALSE,
        "isUserDiceTossForbidden" = FALSE,
        "updatedAt" = NOW()
    WHERE "userId" = ${c.req.param('id')}
  `;
  return c.json({ success: true });
});

app.get('/admin/invites', authMiddleware, async (c) => {
  const rows = await sql`
    SELECT i.id, i."expiresAt", i."usedAt", i."revokedAt", i."createdAt",
      creator."displayName" AS "createdBy", used_by."displayName" AS "usedBy"
    FROM tb_admin_invite i
    LEFT JOIN tb_admin_user creator ON creator.id = i."createdByAdminUserId"
    LEFT JOIN tb_admin_user used_by ON used_by.id = i."usedByAdminUserId"
    ORDER BY i."createdAt" DESC
    LIMIT 100
  `;
  return c.json({ items: rows });
});

app.post('/admin/invites', authMiddleware, async (c) => {
  const admin = c.get('admin');
  const body = await jsonBody(c, z.object({ expiresInHours: z.number().min(1).max(24 * 30) }));
  const expiresAt = new Date(Date.now() + body.expiresInHours * 60 * 60 * 1000);
  const { token, payload } = createInviteJwt(config.jwtSecret, expiresAt);
  const id = uuidv7();
  await sql`
    INSERT INTO tb_admin_invite (
      id, "jtiHash", "tokenHash", "createdByAdminUserId", "expiresAt"
    ) VALUES (
      ${id}, ${sha256Base64Url(payload.jti)}, ${sha256Base64Url(token)}, ${admin.id}, ${expiresAt}
    )
  `;
  return c.json({ invite: { id, expiresAt, token } });
});

app.post('/admin/invites/:id/revoke', authMiddleware, async (c) => {
  await sql`
    UPDATE tb_admin_invite
    SET "revokedAt" = NOW()
    WHERE id = ${c.req.param('id')} AND "usedAt" IS NULL AND "revokedAt" IS NULL
  `;
  return c.json({ success: true });
});

app.get('/admin/analytics/activity-trend', authMiddleware, async (c) => {
  const from = new Date(c.req.query('from') ?? Date.now() - 7 * 24 * 60 * 60 * 1000);
  const to = new Date(c.req.query('to') ?? Date.now());
  const rows = await sql`
    SELECT "hourBucket", "activityCount", "activeUserCount", "skillLogCount"
    FROM tb_admin_activity_hourly
    WHERE "hourBucket" >= ${from} AND "hourBucket" < ${to}
    ORDER BY "hourBucket" ASC
  `;
  return c.json({ items: rows });
});

app.get('/admin/analytics/join-trend', authMiddleware, async (c) => {
  const from = new Date(c.req.query('from') ?? Date.now() - 7 * 24 * 60 * 60 * 1000);
  const to = new Date(c.req.query('to') ?? Date.now());
  const rows = await sql`
    SELECT "hourBucket", "authProvider", "countryCode3", "joinCount"
    FROM tb_admin_join_hourly
    WHERE "hourBucket" >= ${from} AND "hourBucket" < ${to}
    ORDER BY "hourBucket" ASC
  `;
  return c.json({ items: rows });
});

app.get('/admin/analytics/comment-trend', authMiddleware, async (c) => {
  const from = new Date(c.req.query('from') ?? Date.now() - 7 * 24 * 60 * 60 * 1000);
  const to = new Date(c.req.query('to') ?? Date.now());
  const rows = await sql`
    SELECT "hourBucket", "commentCount", "commentingUserCount"
    FROM tb_admin_comment_hourly
    WHERE "hourBucket" >= ${from} AND "hourBucket" < ${to}
    ORDER BY "hourBucket" ASC
  `;
  return c.json({ items: rows });
});

app.get('/admin/analytics/streaks', authMiddleware, async (c) => {
  const days = Math.min(Math.max(Number(c.req.query('days') ?? 3), 1), 365);
  const rows = await sql`
    SELECT COUNT(*)::int AS "userCount"
    FROM (
      SELECT "userId"
      FROM tb_admin_user_streak_daily
      WHERE day >= (CURRENT_DATE - (${days}::int - 1))
      GROUP BY "userId"
      HAVING COUNT(DISTINCT day) >= ${days}
    ) retained
  `;
  return c.json({ days, userCount: rows[0]?.userCount ?? 0 });
});

app.post('/admin/analytics/refresh', authMiddleware, async (c) => {
  const { from, to } = await incrementalRefreshRange();
  await refreshActivityAggregates(from, to);
  return c.json({ success: true, from, to });
});

app.post('/admin/analytics/backfill', authMiddleware, async (c) => {
  const body = await jsonBody(
    c,
    z.object({
      from: z.string().datetime(),
      to: z.string().datetime(),
    }),
  );
  const from = new Date(body.from);
  const to = new Date(body.to);
  if (to <= from) {
    throw new HTTPException(400, { message: '종료 시간이 시작 시간보다 늦어야 합니다.' });
  }
  await refreshActivityAggregates(from, to);
  return c.json({ success: true, from, to });
});

await ensureAdminSchema(sql);
await ensureBootstrapInvite(sql, config);

const runtime = globalThis as typeof globalThis & {
  Bun?: { serve: (options: { port: number; fetch: typeof app.fetch }) => unknown };
};

if (runtime.Bun) {
  runtime.Bun.serve({ port: config.port, fetch: app.fetch });
  console.log(`Mini Dice admin dashboard server listening on ${config.port}`);
} else if (process.env.NODE_ENV !== 'test') {
  console.warn('Bun runtime was not found; export app.fetch for tests/builds only.');
  await sql.end({ timeout: 1 });
}

export default app;
