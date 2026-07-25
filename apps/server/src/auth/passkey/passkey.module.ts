import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasskeyChallengeEntity } from './entity/passkey-challenge.entity';
import { PasskeyEntity } from './entity/passkey.entity';
import { PasskeyChallengeService } from './passkey-challenge.service';
import { PasskeyService } from './passkey.service';
import { PasskeyController } from './passkey.controller';
import { UserModule } from '../../user/user.module';
import { LocalJwtModule } from '../local-jwt/local-jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PasskeyEntity, PasskeyChallengeEntity]),
    UserModule,
    LocalJwtModule,
  ],
  providers: [PasskeyService, PasskeyChallengeService],
  controllers: [PasskeyController],
  exports: [PasskeyService],
})
export class PasskeyModule {}
