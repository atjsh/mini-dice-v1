import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoneyCollectionEntity } from './entity/money-collection.entity';
import { CommonMoneyCollectionService } from './common-money-collection.service';
import { MoneyCollectionParticipantsEntity } from './entity/money-collection-participants.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MoneyCollectionEntity,
      MoneyCollectionParticipantsEntity,
    ]),
  ],
  providers: [CommonMoneyCollectionService],
  exports: [CommonMoneyCollectionService],
})
export class CommonMoneyCollectionModule {}
