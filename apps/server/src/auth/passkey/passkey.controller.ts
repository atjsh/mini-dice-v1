import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { JwtAuthGuard } from '../local-jwt/jwt.guard';
import { UserJwt } from '../../profile/decorators/user.decorator';
import type { UserJwtDto } from '../local-jwt/access-token/dto/user-jwt.dto';
import { PasskeyService } from './passkey.service';
import { GenerateRegistrationOptionsDto } from './dto/register-options.dto';
import { VerifyRegistrationDto } from './dto/verify-registration.dto';
import { GenerateAuthenticationOptionsDto } from './dto/authenticate-options.dto';
import { VerifyAuthenticationDto } from './dto/verify-authentication.dto';
import { RenamePasskeyDto } from './dto/rename-passkey.dto';

@Controller('auth/passkey')
export class PasskeyController {
  constructor(private readonly passkeyService: PasskeyService) {}

  @Post('register/options')
  @UseGuards(JwtAuthGuard)
  async generateRegistrationOptions(@UserJwt() user: UserJwtDto) {
    return this.passkeyService.generateRegistrationOptions(user.userId);
  }

  @Post('register/verify')
  @UseGuards(JwtAuthGuard)
  async verifyRegistration(
    @UserJwt() user: UserJwtDto,
    @Body() dto: VerifyRegistrationDto,
  ) {
    return this.passkeyService.verifyRegistration(
      user.userId,
      dto.credential,
      dto.name,
    );
  }

  @Post('authenticate/options')
  @HttpCode(200)
  async generateAuthenticationOptions(
    @Body() dto: GenerateAuthenticationOptionsDto,
  ) {
    return this.passkeyService.generateAuthenticationOptions(dto?.credentialId);
  }

  @Post('authenticate/verify')
  async verifyAuthentication(
    @Body() dto: VerifyAuthenticationDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    return this.passkeyService.verifyAuthentication(
      dto.challengeId,
      dto.credential,
      response,
    );
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async listPasskeys(@UserJwt() user: UserJwtDto) {
    return this.passkeyService.listPasskeys(user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePasskey(@UserJwt() user: UserJwtDto, @Param('id') id: string) {
    return this.passkeyService.deletePasskey(user.userId, id);
  }

  @Patch(':id/rename')
  @UseGuards(JwtAuthGuard)
  async renamePasskey(
    @UserJwt() user: UserJwtDto,
    @Param('id') id: string,
    @Body() dto: RenamePasskeyDto,
  ) {
    return this.passkeyService.renamePasskey(user.userId, id, dto.name);
  }
}
