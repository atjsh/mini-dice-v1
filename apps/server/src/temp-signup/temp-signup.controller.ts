import { Body, Controller, Post, Res } from '@nestjs/common';
import type { CountryCode3Type } from '@packages/shared-types';
import { IsOptional, MaxLength, MinLength } from 'class-validator';
import type { FastifyReply } from 'fastify';
import { TempSignupService } from './temp-signup.service';

export class TemporarySignUpDto {
  hCaptchaSuccessToken: string;

  @MaxLength(20)
  @MinLength(2)
  @IsOptional()
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
    console.log(dto);

    return await this.tempSignupService.createUser(dto, res);
  }
}
