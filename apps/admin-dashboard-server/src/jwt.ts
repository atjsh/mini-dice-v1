import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

export interface InviteJwtPayload {
  jti: string;
  purpose: 'admin-invite';
  exp: number;
  iat: number;
}

function base64UrlEncode(input: Buffer | string) {
  return Buffer.from(input).toString('base64url');
}

function base64UrlDecode(input: string) {
  return Buffer.from(input, 'base64url').toString('utf8');
}

export function sha256Base64Url(input: string) {
  return createHmac('sha256', 'mini-dice-admin-dashboard')
    .update(input)
    .digest('base64url');
}

function signContent(content: string, secret: string) {
  return createHmac('sha256', secret).update(content).digest('base64url');
}

export function createInviteJwt(secret: string, expiresAt: Date) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload: InviteJwtPayload = {
    jti: randomUUID(),
    purpose: 'admin-invite',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(expiresAt.getTime() / 1000),
  };
  const content = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(
    JSON.stringify(payload),
  )}`;
  return {
    token: `${content}.${signContent(content, secret)}`,
    payload,
  };
}

export function verifyInviteJwt(token: string, secret: string): InviteJwtPayload {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('invalid invite token');
  }
  const [header, payload, signature] = parts;
  const expected = signContent(`${header}.${payload}`, secret);
  if (signature.length !== expected.length) {
    throw new Error('invalid invite token signature');
  }
  if (
    !timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected),
    )
  ) {
    throw new Error('invalid invite token signature');
  }
  const decoded = JSON.parse(base64UrlDecode(payload)) as InviteJwtPayload;
  if (decoded.purpose !== 'admin-invite') {
    throw new Error('invalid invite token purpose');
  }
  if (decoded.exp <= Math.floor(Date.now() / 1000)) {
    throw new Error('invite token expired');
  }
  return decoded;
}
