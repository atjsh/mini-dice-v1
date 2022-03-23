import { ChatElement } from 'chat-element-json-ts';
import { UserActivityMessageElementName } from '.';
import { BaseMessage } from './Message.base.component';

export class UserActivityMessagePropsType implements BaseMessage {
  type: 'diceTossUserActivityMessage' | 'interactionUserActivityMessage';

  title: string;

  description?: string;
}

export type UserActivityMessageType = ChatElement<
  typeof UserActivityMessageElementName,
  UserActivityMessagePropsType
>;

export function UserActivityMessage(
  props: UserActivityMessagePropsType,
): UserActivityMessageType {
  return new ChatElement(UserActivityMessageElementName, props);
}
