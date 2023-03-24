export class RefreshTokenNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RefreshTokenNotFoundException';
  }
}
