import { MessageResponsePropsType, MessageResponse } from '../core-components';

export function MessageResponseFactory(props: MessageResponsePropsType) {
  return JSON.parse(JSON.stringify(MessageResponse(props)));
}
