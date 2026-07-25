export interface AdminConfig {
  port: number;
  databaseUrl: string;
  adminWebUrl: string;
  adminApiUrl: string;
  jwtSecret: string;
  cookieSecret: string;
  cookieSecure: boolean;
  webauthnRpId: string;
  webauthnRpName: string;
  webauthnOrigin: string;
}

function env(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;
  if (value == null || value === '') {
    throw new Error(`${name} is required`);
  }
  return value;
}

function databaseUrlFromEnv() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const host = env('DB_URL');
  const port = env('DB_PORT', '5432');
  const user = env('DB_USER');
  const password = env('DB_PASSWORD');
  const database = env('DB_DATABASE');
  return `postgres://${encodeURIComponent(user)}:${encodeURIComponent(
    password,
  )}@${host}:${port}/${database}`;
}

export function loadConfig(): AdminConfig {
  const adminWebUrl = env('ADMIN_WEB_URL', 'http://127.0.0.1:1244');
  const adminApiUrl = env('ADMIN_API_URL', 'http://127.0.0.1:3020');
  const webHost = new URL(adminWebUrl).hostname;

  return {
    port: Number(env('ADMIN_SERVER_PORT', env('PORT', '3020'))),
    databaseUrl: databaseUrlFromEnv(),
    adminWebUrl,
    adminApiUrl,
    jwtSecret: env('ADMIN_JWT_SECRET', env('JWT_SECRET', 'dev-admin-secret')),
    cookieSecret: env(
      'ADMIN_COOKIE_SECRET',
      env('COOKIE_SIGN_SECRET', 'dev-admin-cookie-secret'),
    ),
    cookieSecure: env('ADMIN_COOKIE_SECURE', 'true') !== 'false',
    webauthnRpId: env('ADMIN_WEBAUTHN_RP_ID', webHost),
    webauthnRpName: env('ADMIN_WEBAUTHN_RP_NAME', 'Mini Dice Admin'),
    webauthnOrigin: env('ADMIN_WEBAUTHN_ORIGIN', adminWebUrl),
  };
}
