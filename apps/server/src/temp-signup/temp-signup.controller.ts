import { Body, Controller, Post, Res } from '@nestjs/common';
import type { CountryCode3Type } from '@packages/shared-types';
import type { FastifyReply } from 'fastify';
import type { TempSignupService } from './temp-signup.service';

export class TemporarySignUpDto {
  hCaptchaSuccessToken: string;
  username?: string;
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
