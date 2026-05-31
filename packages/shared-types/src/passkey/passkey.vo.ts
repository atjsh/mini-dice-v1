export interface PasskeyVo {
  id: string;
  userId: string;
  credentialId: string;
  name: string;
  deviceType: string | null;
  transports: string[] | null;
  createdAt: Date;
  lastUsedAt: Date | null;
}
