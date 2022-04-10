import { LinkType } from './Link.component';

export class LinkGroupType {
  type: 'linkGroup';

  description: string;

  links: LinkType[];
}

export function LinkGroup(props: LinkGroupType): LinkGroupType {
  return props;
}
