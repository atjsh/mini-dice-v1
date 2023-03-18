import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandEntity } from './entity/land.entity';
import { CommonLandService } from './land.service';
import { SkillGroupAliasesModule } from '../../../../skill-group-lib/skill-group-aliases/skill-group-aliases.module';
import { UserActivityModule } from '../../../../user-activity/user-activity.module';
import { UserModule } from '../../../../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LandEntity]),
    UserModule,
    SkillGroupAliasesModule,
    UserActivityModule,
  ],
  providers: [CommonLandService],
  exports: [CommonLandService],
})
export class CommonLandModule {}
