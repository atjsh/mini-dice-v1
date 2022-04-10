import { FormMessageType } from './FormMessage.component';
import { LinkGroupType } from './LinkGroup.component';
import { PlainMessageType } from './PlainMessage.component';
import { UserActivityMessageType } from './UserActivityMessage.component';

/**
 * 클라이언트로 보낼 메세지 객체
 */
export class MessageResponseType {
  userRequestDrawings: UserActivityMessageType[];

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

export function MessageResponse(
  props: MessageResponseType,
): MessageResponseType {
  return props;
}
