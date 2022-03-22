import { MessageResponse, MessageResponsePropsType } from '..';

export function MessageResponseFactory(props: MessageResponsePropsType) {
  return JSON.stringify(MessageResponse(props));
}
