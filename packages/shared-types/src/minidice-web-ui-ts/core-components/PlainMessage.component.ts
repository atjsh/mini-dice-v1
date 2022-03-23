import { ChatElement } from 'chat-element-json-ts';
import { PlainMessageElementName } from './constants';
import { DataFieldType } from './DataField.component';
import { HostedImageType } from './HostedImage.component';
import { BaseMessage } from './Message.base.component';

/**
 * 서비스에서 보낸 메세지
 */
export class PlainMessagePropsType implements BaseMessage {
  // 타입
  type: 'plainMessage';

  // 타이틀
  title?: string;

  // 설명
  description: string;

  // 표시할 DafaField 객체들
  dataFields?: DataFieldType[];

  // 표시할 이미지
  thumbnail?: HostedImageType;
}

export type PlainMessageType = ChatElement<
  typeof PlainMessageElementName,
  PlainMessagePropsType
>;

export function PlainMessage(
  props: Omit<PlainMessagePropsType, 'type'>,
): PlainMessageType {
  return new ChatElement(PlainMessageElementName, {
    ...props,
    type: 'plainMessage',
  });
}
