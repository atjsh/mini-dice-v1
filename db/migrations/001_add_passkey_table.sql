-- Passkey Authentication Schema Migration
-- This migration adds the tb_passkey table for WebAuthn passkey storage

-- Create passkey table
CREATE TABLE IF NOT EXISTS tb_passkey (
    id UUID PRIMARY KEY,
    "userId" UUID NOT NULL,
    "credentialId" VARCHAR(512) UNIQUE NOT NULL,
    "publicKey" TEXT NOT NULL,
    counter INTEGER DEFAULT 0 NOT NULL,
    "deviceType" VARCHAR(20),
    transports TEXT,
    aaguid VARCHAR(100),
    name VARCHAR(100) DEFAULT 'Passkey' NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "lastUsedAt" TIMESTAMP,
    
    -- Foreign key constraint
    CONSTRAINT fk_passkey_user FOREIGN KEY ("userId") 
        REFERENCES tb_user("userId") 
        ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_passkey_userId ON tb_passkey("userId");
CREATE INDEX IF NOT EXISTS idx_passkey_credentialId ON tb_passkey("credentialId");

-- Comments for documentation
COMMENT ON TABLE tb_passkey IS 'Stores WebAuthn passkey credentials for passwordless authentication';
COMMENT ON COLUMN tb_passkey.id IS 'Primary key (UUID v7)';
COMMENT ON COLUMN tb_passkey."userId" IS 'Foreign key to tb_user';
COMMENT ON COLUMN tb_passkey."credentialId" IS 'Base64url-encoded credential ID (unique)';
COMMENT ON COLUMN tb_passkey."publicKey" IS 'Base64url-encoded public key';
COMMENT ON COLUMN tb_passkey.counter IS 'Authentication counter for replay protection';
COMMENT ON COLUMN tb_passkey."deviceType" IS 'Type: "platform" or "cross-platform"';
COMMENT ON COLUMN tb_passkey.transports IS 'Available transports: internal, usb, ble, nfc';
COMMENT ON COLUMN tb_passkey.aaguid IS 'Authenticator AAGUID';
COMMENT ON COLUMN tb_passkey.name IS 'User-friendly name for the passkey';
COMMENT ON COLUMN tb_passkey."lastUsedAt" IS 'Timestamp of last successful authentication';
