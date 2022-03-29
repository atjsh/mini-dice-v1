export enum ValidationError {
  TOOLONG = 'long',
  TOOSHORT = 'short',
}

export function validateUsername(username: string): true | ValidationError {
  if (username.length == 0) {
    return true;
  }
  if (username.length < 2) {
    return ValidationError.TOOSHORT;
  } else if (username.length > 20) {
    return ValidationError.TOOLONG;
  }
  return true;
}
