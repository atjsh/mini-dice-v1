-- User Preferences and Web Push Schema Migration
-- This migration adds preference storage, push subscriptions, and online heartbeat state.

CREATE TABLE IF NOT EXISTS tb_user_preference (
    id UUID PRIMARY KEY,
    "userId" UUID NOT NULL UNIQUE,
    "alwaysHideComments" BOOLEAN DEFAULT FALSE NOT NULL,
    "pushNotificationsEnabled" BOOLEAN DEFAULT FALSE NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,

    CONSTRAINT fk_user_preference_user FOREIGN KEY ("userId")
        REFERENCES tb_user("userId")
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tb_push_subscriptions (
    id UUID PRIMARY KEY,
    "userId" UUID NOT NULL,
    endpoint TEXT NOT NULL,
    "p256dhKey" TEXT,
    "authKey" TEXT,
    "expirationTime" TIMESTAMP,
    "isActive" BOOLEAN DEFAULT TRUE NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,

    CONSTRAINT fk_push_subscription_user FOREIGN KEY ("userId")
        REFERENCES tb_user("userId")
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_push_subscription_userId
    ON tb_push_subscriptions("userId");
CREATE INDEX IF NOT EXISTS idx_push_subscription_endpoint
    ON tb_push_subscriptions(endpoint);
CREATE INDEX IF NOT EXISTS idx_push_subscription_active
    ON tb_push_subscriptions("isActive");

CREATE TABLE IF NOT EXISTS tb_user_online_sessions (
    "userId" UUID PRIMARY KEY,
    "lastHeartbeat" TIMESTAMP NOT NULL,
    "sessionId" VARCHAR(255),
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,

    CONSTRAINT fk_user_online_session_user FOREIGN KEY ("userId")
        REFERENCES tb_user("userId")
        ON DELETE CASCADE
);
