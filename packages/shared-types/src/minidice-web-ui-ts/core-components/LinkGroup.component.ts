import { ChatElement } from 'chat-element-json-ts';
import { LinkGroupElementName, LinkType } from '.';

export class LinkGroupPropsType {
  type: 'linkGroup';

  description: string;

  links: LinkType[];
}

export type LinkGroupType = ChatElement<
  typeof LinkGroupElementName,
  LinkGroupPropsType
>;

export function LinkGroup(props: LinkGroupPropsType): LinkGroupType {
  return new ChatElement(LinkGroupElementName, props);
}
