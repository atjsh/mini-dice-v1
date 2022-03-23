import { ChatElement } from 'chat-element-json-ts';
import { MessageResponseElementName } from './constants';
import { FormMessageType } from './FormMessage.component';
import { LinkGroupType } from './LinkGroup.component';
import { PlainMessageType } from './PlainMessage.component';
import { UserActivityMessageType } from './UserActivityMessage.component';

/**
 * 클라이언트로 보낼 메세지 객체
 */
export class MessageResponsePropsType {
  userRequestDrawings: UserActivityMessageType;

  // 메세지들
  actionResultDrawings: (
    | PlainMessageType
    | FormMessageType
    | PlainMessageType[]
    | FormMessageType[]
    | LinkGroupType
  )[];

  // 메세지들을 보낸 날짜
  date: Date;
}

export type MessageResponseType = ChatElement<
  typeof MessageResponseElementName,
  MessageResponsePropsType
>;

export function MessageResponse(
  props: MessageResponsePropsType,
): MessageResponseType {
  return new ChatElement(MessageResponseElementName, props);
}
