import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillGroupAliasesModule } from 'apps/server/src/skill-group-lib/skill-group-aliases/skill-group-aliases.module';
import { UserActivityModule } from 'apps/server/src/user-activity/user-activity.module';
import { UserModule } from 'apps/server/src/user/user.module';
import { LandEntity } from './entity/land.entity';
import { CommonLandService } from './land.service';

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
