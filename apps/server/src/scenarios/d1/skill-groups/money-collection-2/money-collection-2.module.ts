import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserActivityModule } from '../../../../user-activity/user-activity.module';
import { CommonMoneyCollectionModule } from '../../common/money-collection/common-money-collection.module';
import { MoneyCollection2Service } from './money-collection-2.service';
import { MoneyCollection2SkillGroup } from './money-collection-2.skillgroup';

@Module({
  imports: [TypeOrmModule, CommonMoneyCollectionModule, UserActivityModule],
  providers: [MoneyCollection2Service, MoneyCollection2SkillGroup],
})
export class MoneyCollection2Module {}
