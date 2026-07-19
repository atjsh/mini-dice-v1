export interface PasskeyVo {
  id: string;
  userId: string;
  credentialId: string;
  name: string;
  aaguid: string | null;
  deviceType: string | null;
  transports: string[] | null;
  createdAt: Date;
  lastUsedAt: Date | null;
}
