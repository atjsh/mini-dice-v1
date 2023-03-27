import { Length } from 'class-validator';

export interface UserLandComponentInput {
  comment: string;
}

export class UserLandCommentInputDto implements UserLandComponentInput {
  @Length(1, 100)
  comment: string;
}
