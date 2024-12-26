import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DATASOURCE_NAMES } from '../../common/datasource-names';
import { MySQLMoneyCollectionParticipantsEntity } from '../../entities/mysql/mysql-money-collection-participants.entity';
import { PgMoneyCollectionParticipantEntity } from '../../entities/postgresql/pg-money-collection-participants.entity';
import { ConvertedUsersMap } from './user.data-convertor.service';

@Injectable()
export class MoneyCollectionParticipantDataConvertorService {
  constructor(
    @InjectRepository(
      MySQLMoneyCollectionParticipantsEntity,
      DATASOURCE_NAMES.MYSQL,
    )
    private readonly mysqlMoneyCollectionParticipantRepository: Repository<MySQLMoneyCollectionParticipantsEntity>,

    @InjectRepository(
      PgMoneyCollectionParticipantEntity,
      DATASOURCE_NAMES.POSTGRESQL,
    )
    private readonly pgMoneyCollectionParticipantRepository: Repository<PgMoneyCollectionParticipantEntity>,
  ) {}

  public async convertMoneyCollectionParticipants(
    convertedUserMap: ConvertedUsersMap,
  ): Promise<void> {
    const mysqlMoneyCollectionParticipants =
      await this.mysqlMoneyCollectionParticipantRepository.find({
        transaction: false,
      });

    const pgMoneyCollectionParticipants = mysqlMoneyCollectionParticipants.map(
      (mysqlMoneyCollectionParticipant) =>
        this.pgMoneyCollectionParticipantRepository.create({
          ...mysqlMoneyCollectionParticipant,
          userId: convertedUserMap[mysqlMoneyCollectionParticipant.userId],
        }),
    );

    await this.pgMoneyCollectionParticipantRepository.save(
      pgMoneyCollectionParticipants,
      {
        transaction: false,
      },
    );
  }
}
