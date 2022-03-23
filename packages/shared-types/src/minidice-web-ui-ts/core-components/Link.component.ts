import { ChatElement } from 'chat-element-json-ts';
import { LinkElementName } from '.';

export class LinkPropsType<T = Record<string, string>> {
  skillRouteURL: string;

  param: T;

  displayText: string;
}

export type LinkType<T = Record<string, string>> = ChatElement<
  typeof LinkElementName,
  LinkPropsType<T>
>;

export function Link<T = Record<string, string>>(
  props: LinkPropsType<T>,
): LinkType<T> {
  return new ChatElement(LinkElementName, props);
}
