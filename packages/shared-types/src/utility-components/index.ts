import { MessageResponse, MessageResponsePropsType } from '..';

export function MessageResponseFactory(props: MessageResponsePropsType) {
  return JSON.parse(JSON.stringify(MessageResponse(props)));
}
