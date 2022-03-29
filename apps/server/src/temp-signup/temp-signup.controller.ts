import { Body, Controller, Post, Res } from '@nestjs/common';
import { CountryCode3Type } from '@packages/shared-types';
import { FastifyReply } from 'fastify';
import { TempSignupService } from './temp-signup.service';

export class TemporarySignUpDto {
  hCaptchaSuccessToken: string;
  username: string;
  countryCode3: CountryCode3Type;
}

@Controller('temp-signup')
export class TempSignupController {
  constructor(private readonly tempSignupService: TempSignupService) {}

  @Post('')
  async temporarySignUpUser(
    @Body() dto: TemporarySignUpDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    return await this.tempSignupService.createUser(dto, res);
  }
}
