import { Body, Controller, Post, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { TempSignupService } from './temp-signup.service';

export class TemporarySignUpDto {
  hCaptchaSuccessToken: string;
  username: string;
}

@Controller('temp-signup')
export class TempSignupController {
  constructor(private readonly tempSignupService: TempSignupService) {}

  @Post('')
  async temporarySignUpUser(
    @Body() dto: TemporarySignUpDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    return await this.tempSignupService.createUser(
      dto.hCaptchaSuccessToken,
      dto.username,
      res,
    );
  }
}
