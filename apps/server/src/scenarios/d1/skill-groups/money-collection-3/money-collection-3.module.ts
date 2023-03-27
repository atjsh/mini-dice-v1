import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserActivityModule } from '../../../../user-activity/user-activity.module';
import { CommonMoneyCollectionModule } from '../../common/money-collection/common-money-collection.module';
import { MoneyCollection3Service } from './money-collection-3.service';
import { MoneyCollection3SkillGroup } from './money-collection-3.skillgroup';

@Module({
  imports: [TypeOrmModule, CommonMoneyCollectionModule, UserActivityModule],
  providers: [MoneyCollection3Service, MoneyCollection3SkillGroup],
})
export class MoneyCollection3Module {}
