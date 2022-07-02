import { Body, Controller, Post } from '@nestjs/common';
import { UserLandCommentInputDto } from '@packages/shared-types';
import { UserJwtDto } from '../auth/local-jwt/access-token/dto/user-jwt.dto';
import { JwtAuth, UserJwt } from '../profile/decorators/user.decorator';
import { UserLandCommentService } from './user-land-comment.service';

@Controller('land-comments')
export class UserLandCommentController {
  constructor(private userLandCommentService: UserLandCommentService) {}

  @JwtAuth()
  @Post('')
  async registerComment(
    @UserJwt() { userId }: UserJwtDto,
    @Body() { comment }: UserLandCommentInputDto,
  ) {
    return this.userLandCommentService.registerComment(userId, comment);
  }
}
