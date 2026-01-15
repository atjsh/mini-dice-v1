import type { PasskeyVo } from './passkey.vo';

export type PasskeyListItemDto = Pick<
  PasskeyVo,
  'id' | 'name' | 'deviceType' | 'createdAt' | 'lastUsedAt'
>;
