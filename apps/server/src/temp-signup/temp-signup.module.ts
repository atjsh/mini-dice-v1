import { Module } from '@nestjs/common';
import { LocalJwtModule } from '../auth/local-jwt/local-jwt.module';
import { HcaptchaModule } from '../h-captcha/h-captcha.module';
import { UserModule } from '../user/user.module';
import { TempSignupController } from './temp-signup.controller';
import { TempSignupService } from './temp-signup.service';

@Module({
  imports: [UserModule, HcaptchaModule, LocalJwtModule],
  controllers: [TempSignupController],
  providers: [TempSignupService],
})
export class TempSignupModule {}
