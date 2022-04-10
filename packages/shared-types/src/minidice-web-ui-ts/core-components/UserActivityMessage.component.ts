import { BaseMessage } from './Message.base.component';

export class UserActivityMessageType implements BaseMessage {
  type: 'diceTossUserActivityMessage' | 'interactionUserActivityMessage';

  title: string;

  description?: string;
}

export function UserActivityMessage(
  props: UserActivityMessageType,
): UserActivityMessageType {
  return props;
}
