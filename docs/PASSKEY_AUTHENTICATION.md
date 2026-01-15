# Passkey (WebAuthn) Authentication

This document explains the passkey authentication implementation and how to configure it.

## Overview

Passkey authentication allows users to log in using WebAuthn-compatible authenticators (fingerprint, face recognition, security keys, etc.) instead of passwords. This provides a more secure and user-friendly authentication experience.

## Configuration

### Environment Variables

Add the following variables to your `.env` file:

```bash
# WebAuthn Configuration
WEBAUTHN_RP_ID=yourdomain.com
WEBAUTHN_RP_NAME=Mini Dice
WEBAUTHN_ORIGIN=https://yourdomain.com
```

### Database Migration

Run the migration script to create the passkey table:

```bash
psql -U your_user -d your_database -f db/migrations/001_add_passkey_table.sql
```

## Business Rules

1. **Passkey Limit**: Users can register up to 100 passkeys per account
2. **Deletion Restriction**: Cannot delete last passkey without Google account
3. **Mandatory for Anonymous Signup**: signupCompleted=false until passkey registered
4. **Authentication Flow**: Issues refresh token cookie on successful authentication

See the full documentation in the file for API endpoints and troubleshooting.
