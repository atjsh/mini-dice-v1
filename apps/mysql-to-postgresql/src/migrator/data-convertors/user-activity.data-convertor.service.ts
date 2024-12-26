import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DATASOURCE_NAMES } from '../../common/datasource-names';
import { MySQLUserActivityEntity } from '../../entities/mysql/mysql-user-activity.entity';
import { PgUserActivityEntity } from '../../entities/postgresql/pg-user-activity.entity';
import { ConvertedUsersMap } from './user.data-convertor.service';

const CONVERT_USER_ACTIVITY_SIZE = 50; // 한 유저당 무조건 50개만 변환

@Injectable()
export class UserActivityDataConvertorService {
  constructor(
    @InjectRepository(MySQLUserActivityEntity, DATASOURCE_NAMES.MYSQL)
    private readonly mysqlUserActivityRepository: Repository<MySQLUserActivityEntity>,

    @InjectRepository(PgUserActivityEntity, DATASOURCE_NAMES.POSTGRESQL)
    private readonly pgUserActivityRepository: Repository<PgUserActivityEntity>,
  ) {}

  public async convertUserActivities(
    convertedUsersMap: ConvertedUsersMap,
  ): Promise<void> {
    const oldUserIds = Object.keys(convertedUsersMap);

    for (const oldUserId of oldUserIds) {
      const userActivities = await this.getUserActivities(oldUserId);

      await this.convertAndInsertUserActivities(
        userActivities,
        convertedUsersMap[oldUserId],
      );
    }
  }

  private async getUserActivities(
    oldUserId: string,
  ): Promise<MySQLUserActivityEntity[]> {
    return this.mysqlUserActivityRepository.find({
      where: {
        userId: oldUserId,
      },
      take: CONVERT_USER_ACTIVITY_SIZE,
      order: {
        createdAt: 'desc',
      },
      transaction: false,
    });
  }

  private async convertAndInsertUserActivities(
    userActivities: MySQLUserActivityEntity[],
    newUserId: string,
  ): Promise<void> {
    const pgUserActivities = userActivities.map((userActivity) =>
      this.convertUserActivity(userActivity, newUserId),
    );

    await this.pgUserActivityRepository.save(pgUserActivities, {
      transaction: false,
    });
  }

  private convertUserActivity(
    userActivity: MySQLUserActivityEntity,
    newUserId: string,
  ): PgUserActivityEntity {
    const pgUserActivity = new PgUserActivityEntity();

    pgUserActivity.userId = newUserId;
    pgUserActivity.skillDrawProps = userActivity.skillDrawProps;
    pgUserActivity.skillRoute = userActivity.skillRoute;
    pgUserActivity.read = userActivity.read;
    pgUserActivity.createdAt = userActivity.createdAt;

    return pgUserActivity;
  }
}
