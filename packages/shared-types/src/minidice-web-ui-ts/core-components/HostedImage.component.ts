import { ChatElement } from 'chat-element-json-ts';
import { HostedImageElementName } from './constants';

export class HostedImagePropsType {
  imageUrl: string;
  altName: string;
}

export type HostedImageType = ChatElement<
  typeof HostedImageElementName,
  HostedImagePropsType
>;

export function HostedImage(props: HostedImagePropsType): HostedImageType {
  return new ChatElement(HostedImageElementName, props);
}
