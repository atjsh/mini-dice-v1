import { webcrypto } from 'node:crypto';

// SimpleWebAuthn expects WebCrypto on globalThis, but the deployed serverless
// runtime does not expose it by default.
if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    configurable: true,
  });
}
