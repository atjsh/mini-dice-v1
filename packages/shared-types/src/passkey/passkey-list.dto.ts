import type { PasskeyVo } from './passkey.vo';

export type PasskeyListItemDto = Pick<
  PasskeyVo,
  'id' | 'name' | 'aaguid' | 'deviceType' | 'createdAt' | 'lastUsedAt'
>;
