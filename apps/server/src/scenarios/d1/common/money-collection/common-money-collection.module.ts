import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonMoneyCollectionService } from './common-money-collection.service';
import { MoneyCollectionParticipantsEntity } from './entity/money-collection-participants.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MoneyCollectionParticipantsEntity])],
  providers: [CommonMoneyCollectionService],
  exports: [CommonMoneyCollectionService],
})
export class CommonMoneyCollectionModule {}
