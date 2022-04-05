import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillGroupAliasesModule } from 'apps/server/src/skill-group-lib/skill-group-aliases/skill-group-aliases.module';
import { UserModule } from 'apps/server/src/user/user.module';
import { D1Module } from '../../d1.module';
import { LandEntity } from './entity/land.entity';
import { CommonLandService } from './land.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LandEntity]),
    UserModule,
    SkillGroupAliasesModule,
  ],
  providers: [CommonLandService],
  exports: [CommonLandService],
})
export class CommonLandModule {}
