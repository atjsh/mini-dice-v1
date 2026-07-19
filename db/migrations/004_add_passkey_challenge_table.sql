-- Passkey Challenge Redemption Ledger
-- Stores only challenge digests so Lambda instances do not retain ceremony state.

CREATE TABLE IF NOT EXISTS tb_passkey_challenge (
    digest VARCHAR(43) PRIMARY KEY,
    type VARCHAR(20) NOT NULL,
    "userId" UUID,
    "expiresAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,

    CONSTRAINT chk_passkey_challenge_type
        CHECK (type IN ('registration', 'authentication')),
    CONSTRAINT chk_passkey_challenge_user_binding
        CHECK (
            (type = 'registration' AND "userId" IS NOT NULL)
            OR (type = 'authentication' AND "userId" IS NULL)
        ),
    CONSTRAINT fk_passkey_challenge_user FOREIGN KEY ("userId")
        REFERENCES tb_user("userId")
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_passkey_challenge_expiresAt
    ON tb_passkey_challenge("expiresAt");

COMMENT ON TABLE tb_passkey_challenge IS
    'Single-use redemption ledger for WebAuthn challenges';
COMMENT ON COLUMN tb_passkey_challenge.digest IS
    'SHA-256/base64url digest of the WebAuthn challenge';
COMMENT ON COLUMN tb_passkey_challenge.type IS
    'WebAuthn ceremony: registration or authentication';
COMMENT ON COLUMN tb_passkey_challenge."userId" IS
    'Registration user binding; null for authentication';
