import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasskeyEntity } from './entity/passkey.entity';
import { PasskeyService } from './passkey.service';
import { PasskeyController } from './passkey.controller';
import { UserModule } from '../../user/user.module';
import { LocalJwtModule } from '../local-jwt/local-jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PasskeyEntity]),
    UserModule,
    LocalJwtModule,
  ],
  providers: [PasskeyService],
  controllers: [PasskeyController],
  exports: [PasskeyService],
})
export class PasskeyModule {}
