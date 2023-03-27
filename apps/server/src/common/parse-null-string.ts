export function parseNullString(rawString: string): string | null {
  if (rawString === 'null') {
    return null;
  }

  return rawString;
}
