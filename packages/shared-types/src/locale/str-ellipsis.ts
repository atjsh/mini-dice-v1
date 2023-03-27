export const strEllipsis = (
  str: string,
  length: number,
  alternativeEllipsis = '...',
) =>
  str.length > length ? str.slice(0, length).concat(alternativeEllipsis) : str;
