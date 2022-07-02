import { Length } from 'class-validator';

export class UserLandCommentInputDto {
  @Length(1, 100)
  comment: string;
}
