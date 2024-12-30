import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MySQLLandEntity } from '../../entities/mysql/mysql-land.entity';
import { DATASOURCE_NAMES } from '../../common/datasource-names';
import { Repository } from 'typeorm';
import { PgLandEntity } from '../../entities/postgresql/pg-land.entity';
import { ConvertedUsersMap } from './user.data-convertor.service';

@Injectable()
export class LandDataConvertorService {
  constructor(
    @InjectRepository(MySQLLandEntity, DATASOURCE_NAMES.MYSQL)
    private readonly mysqlLandRepository: Repository<MySQLLandEntity>,

    @InjectRepository(PgLandEntity, DATASOURCE_NAMES.POSTGRESQL)
    private readonly pgLandRepository: Repository<PgLandEntity>,
  ) {}

  public async convertLands(convertedUserMap: ConvertedUsersMap) {
    const mysqlLands = await this.mysqlLandRepository.find({
      transaction: false,
    });

    const pgLands = mysqlLands.map((mysqlLand) =>
      this.pgLandRepository.create({
        ...mysqlLand,
        userId: convertedUserMap[mysqlLand.userId],
      }),
    );

    await this.pgLandRepository.save(pgLands, { transaction: false });
  }
}
