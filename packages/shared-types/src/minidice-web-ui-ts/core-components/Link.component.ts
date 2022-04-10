export class LinkType<T = Record<string, string>> {
  skillRouteURL: string;

  param: T;

  displayText: string;
}

export function Link<T = Record<string, string>>(props: LinkType<T>) {
  return props;
}
