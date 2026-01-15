import { Module } from '@nestjs/common';
import { LocalJwtModule } from '../auth/local-jwt/local-jwt.module';
import { TurnstileModule } from '../turnstile/turnstile.module';
import { UserModule } from '../user/user.module';
import { TempSignupController } from './temp-signup.controller';
import { TempSignupService } from './temp-signup.service';

@Module({
  imports: [UserModule, TurnstileModule, LocalJwtModule],
  controllers: [TempSignupController],
  providers: [TempSignupService],
})
export class TempSignupModule {}
