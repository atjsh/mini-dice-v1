import { HostedImageType } from './HostedImage.component';
import { BaseMessage } from './Message.base.component';

export class NotificationMessageType implements BaseMessage {
  type: 'notificationMessage';

  title: string;

  description: string;

  thumbnail?: HostedImageType;

  date: string;
}

export function NotificationMessage(
  props: Omit<NotificationMessageType, 'type'>,
): NotificationMessageType {
  return {
    ...props,
    type: 'notificationMessage',
  };
}
