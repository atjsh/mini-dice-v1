-- Admin Dashboard Schema
-- The Hono/Bun admin-dashboard-server also creates these tables on startup.
-- This file documents the required Postgres shape for branch and production DBs.

CREATE TABLE IF NOT EXISTS tb_admin_user (
    id UUID PRIMARY KEY,
    "displayName" VARCHAR(120) NOT NULL,
    role VARCHAR(40) NOT NULL DEFAULT 'admin',
    "isDisabled" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "lastLoginAt" TIMESTAMP
);

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
);

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
);

CREATE TABLE IF NOT EXISTS tb_admin_session (
    id UUID PRIMARY KEY,
    "adminUserId" UUID NOT NULL REFERENCES tb_admin_user(id) ON DELETE CASCADE,
    "expiresAt" TIMESTAMP NOT NULL,
    "revokedAt" TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "lastSeenAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tb_admin_webauthn_challenge (
    id UUID PRIMARY KEY,
    type VARCHAR(20) NOT NULL,
    challenge TEXT NOT NULL,
    "adminUserId" UUID,
    "inviteId" UUID,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    "expiresAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tb_admin_activity_hourly (
    "hourBucket" TIMESTAMP PRIMARY KEY,
    "activityCount" INTEGER NOT NULL DEFAULT 0,
    "activeUserCount" INTEGER NOT NULL DEFAULT 0,
    "skillLogCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tb_admin_join_hourly (
    "hourBucket" TIMESTAMP NOT NULL,
    "authProvider" VARCHAR(40) NOT NULL,
    "countryCode3" VARCHAR(3) NOT NULL,
    "joinCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY ("hourBucket", "authProvider", "countryCode3")
);

CREATE TABLE IF NOT EXISTS tb_admin_comment_hourly (
    "hourBucket" TIMESTAMP PRIMARY KEY,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "commentingUserCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tb_admin_user_streak_daily (
    day DATE NOT NULL,
    "userId" UUID NOT NULL,
    "activityCount" INTEGER NOT NULL DEFAULT 0,
    "skillLogCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (day, "userId")
);

CREATE TABLE IF NOT EXISTS tb_admin_analytics_refresh_state (
    "aggregateName" VARCHAR(80) PRIMARY KEY,
    "lastSourceAt" TIMESTAMP,
    "lastRefreshedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
