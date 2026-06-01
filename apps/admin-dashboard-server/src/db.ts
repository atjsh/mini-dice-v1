import postgres from 'postgres';
import { v7 as uuidv7 } from 'uuid';
import type { AdminConfig } from './config';
import { createInviteJwt, sha256Base64Url } from './jwt';

export type Sql = postgres.Sql;

export interface AdminUser {
  id: string;
  displayName: string;
  role: string;
  isDisabled: boolean;
}

export function createSql(config: AdminConfig) {
  return postgres(config.databaseUrl, {
    max: 8,
    ssl:
      process.env.DB_SSL_MODE_REQUIRED &&
      process.env.DB_SSL_MODE_REQUIRED !== 'false'
        ? 'require'
        : undefined,
  });
}

export async function ensureAdminSchema(sql: Sql) {
  await sql.begin(async (tx) => {
    await tx`
      CREATE TABLE IF NOT EXISTS tb_admin_user (
        id UUID PRIMARY KEY,
        "displayName" VARCHAR(120) NOT NULL,
        role VARCHAR(40) NOT NULL DEFAULT 'admin',
        "isDisabled" BOOLEAN NOT NULL DEFAULT FALSE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "lastLoginAt" TIMESTAMP
      )
    `;
    await tx`
      CREATE TABLE IF NOT EXISTS tb_admin_passkey (
        id UUID PRIMARY KEY,
        "adminUserId" UUID NOT NULL REFERENCES tb_admin_user(id) ON DELETE CASCADE,
        "credentialId" VARCHAR(512) UNIQUE NOT NULL,
        "publicKey" TEXT NOT NULL,
        counter INTEGER NOT NULL DEFAULT 0,
        "deviceType" VARCHAR(40),
        transports TEXT,
        name VARCHAR(120) NOT NULL DEFAULT 'Admin passkey',
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "lastUsedAt" TIMESTAMP
      )
    `;
    await tx`
      CREATE TABLE IF NOT EXISTS tb_admin_invite (
        id UUID PRIMARY KEY,
        "jtiHash" VARCHAR(128) UNIQUE NOT NULL,
        "tokenHash" VARCHAR(128) NOT NULL,
        "createdByAdminUserId" UUID REFERENCES tb_admin_user(id) ON DELETE SET NULL,
        "expiresAt" TIMESTAMP NOT NULL,
        "usedAt" TIMESTAMP,
        "usedByAdminUserId" UUID REFERENCES tb_admin_user(id) ON DELETE SET NULL,
        "revokedAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    await tx`
      CREATE TABLE IF NOT EXISTS tb_admin_session (
        id UUID PRIMARY KEY,
        "adminUserId" UUID NOT NULL REFERENCES tb_admin_user(id) ON DELETE CASCADE,
        "expiresAt" TIMESTAMP NOT NULL,
        "revokedAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "lastSeenAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    await tx`
      CREATE TABLE IF NOT EXISTS tb_admin_webauthn_challenge (
        id UUID PRIMARY KEY,
        type VARCHAR(20) NOT NULL,
        challenge TEXT NOT NULL,
        "adminUserId" UUID,
        "inviteId" UUID,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        "expiresAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    await tx`
      CREATE TABLE IF NOT EXISTS tb_admin_activity_hourly (
        "hourBucket" TIMESTAMP PRIMARY KEY,
        "activityCount" INTEGER NOT NULL DEFAULT 0,
        "activeUserCount" INTEGER NOT NULL DEFAULT 0,
        "skillLogCount" INTEGER NOT NULL DEFAULT 0,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    await tx`
      CREATE TABLE IF NOT EXISTS tb_admin_join_hourly (
        "hourBucket" TIMESTAMP NOT NULL,
        "authProvider" VARCHAR(40) NOT NULL,
        "countryCode3" VARCHAR(3) NOT NULL,
        "joinCount" INTEGER NOT NULL DEFAULT 0,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        PRIMARY KEY ("hourBucket", "authProvider", "countryCode3")
      )
    `;
    await tx`
      CREATE TABLE IF NOT EXISTS tb_admin_comment_hourly (
        "hourBucket" TIMESTAMP PRIMARY KEY,
        "commentCount" INTEGER NOT NULL DEFAULT 0,
        "commentingUserCount" INTEGER NOT NULL DEFAULT 0,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    await tx`
      CREATE TABLE IF NOT EXISTS tb_admin_user_streak_daily (
        day DATE NOT NULL,
        "userId" UUID NOT NULL,
        "activityCount" INTEGER NOT NULL DEFAULT 0,
        "skillLogCount" INTEGER NOT NULL DEFAULT 0,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        PRIMARY KEY (day, "userId")
      )
    `;
    await tx`
      CREATE TABLE IF NOT EXISTS tb_admin_analytics_refresh_state (
        "aggregateName" VARCHAR(80) PRIMARY KEY,
        "lastSourceAt" TIMESTAMP,
        "lastRefreshedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    await tx`CREATE INDEX IF NOT EXISTS idx_admin_comment_created_at ON tb_user_land_comment("createdAt")`;
    await tx`CREATE INDEX IF NOT EXISTS idx_admin_user_created_at ON tb_user("createdAt")`;
  });
}

export async function ensureBootstrapInvite(sql: Sql, config: AdminConfig) {
  const admins = await sql`SELECT COUNT(*)::int AS count FROM tb_admin_user`;
  if (admins[0]?.count > 0) {
    return;
  }
  const existing = await sql`
    SELECT id FROM tb_admin_invite
    WHERE "usedAt" IS NULL AND "revokedAt" IS NULL AND "expiresAt" > NOW()
    LIMIT 1
  `;
  if (existing.length > 0) {
    return;
  }

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const { token, payload } = createInviteJwt(config.jwtSecret, expiresAt);
  await sql`
    INSERT INTO tb_admin_invite (
      id, "jtiHash", "tokenHash", "expiresAt"
    ) VALUES (
      ${uuidv7()}, ${sha256Base64Url(payload.jti)}, ${sha256Base64Url(token)}, ${expiresAt}
    )
  `;
  console.log(`Mini Dice admin bootstrap invite: ${token}`);
}
