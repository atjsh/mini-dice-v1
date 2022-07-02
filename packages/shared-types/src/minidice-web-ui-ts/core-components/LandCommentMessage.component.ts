import { LandCommentVo } from '@packages/shared-types/land-comment/land-comment.vo';
import { BaseMessage } from './Message.base.component';

export class LandCommentsMessageType implements BaseMessage {
  // 타입
  type: 'landComments';

  landComments: LandCommentVo[];
}

export function LandCommentsMessage(
  props: Omit<LandCommentsMessageType, 'type'>,
): LandCommentsMessageType {
  return {
    ...props,
    type: 'landComments',
  };
}
