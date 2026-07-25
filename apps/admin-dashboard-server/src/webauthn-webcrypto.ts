import { webcrypto } from 'node:crypto';

const globalWithCrypto = globalThis as typeof globalThis & {
  crypto?: Crypto;
};

if (!globalWithCrypto.crypto) {
  globalWithCrypto.crypto = webcrypto as unknown as Crypto;
}
