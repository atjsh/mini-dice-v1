import { Module } from '@nestjs/common';
import { UserActivityModule } from 'apps/server/src/user-activity/user-activity.module';
import { CommonMoneyCollectionModule } from '../../common/money-collection/common-money-collection.module';
import { MoneyCollection1Service } from './money-collection-1.service';
import { MoneyCollection1SkillGroup } from './money-collection-1.skillgroup';

@Module({
  imports: [CommonMoneyCollectionModule, UserActivityModule],
  providers: [MoneyCollection1Service, MoneyCollection1SkillGroup],
})
export class MoneyCollection1Module {}
