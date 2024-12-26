import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DATASOURCE_NAMES } from '../../common/datasource-names';
import { MySQLUserEntity } from '../../entities/mysql/mysql-user.entity';
import { PgUserEntity } from '../../entities/postgresql/pg-user.entity';

type OldUserId = string;
type NewUserId = string; // uuid

const CONVERT_USERS_BATCH_SIZE = 3000;

export type ConvertedUsersMap = Record<OldUserId, NewUserId>;

@Injectable()
export class UserDataConvertorService {
  constructor(
    @InjectRepository(MySQLUserEntity, DATASOURCE_NAMES.MYSQL)
    private readonly mysqlUserRepository: Repository<MySQLUserEntity>,

    @InjectRepository(PgUserEntity, DATASOURCE_NAMES.POSTGRESQL)
    private readonly pgUserRepository: Repository<PgUserEntity>,
  ) {}

  public async getConvertedUsersMap(): Promise<ConvertedUsersMap> {
    const users = await this.pgUserRepository.find({ transaction: false });
    const convertedUsersMap: ConvertedUsersMap = {};

    users.forEach((user) => {
      convertedUsersMap[user.userIdv1] = user.id;
    });

    return convertedUsersMap;
  }

  public async convertUsers(): Promise<ConvertedUsersMap> {
    const convertedUsersMap: ConvertedUsersMap = {};

    let offset = 0;
    let usersBatch: MySQLUserEntity[] = await this.getUsersBatch(offset);

    while (usersBatch.length) {
      const newUsers = await this.convertAndInsertUsersPerBatch(usersBatch);
      newUsers.forEach((newUser) => {
        convertedUsersMap[newUser.oldId] = newUser.newId;
      });

      offset += CONVERT_USERS_BATCH_SIZE;
      usersBatch = await this.getUsersBatch(offset);
    }

    return convertedUsersMap;
  }

  private async getUsersBatch(offset: number): Promise<MySQLUserEntity[]> {
    return this.mysqlUserRepository.find({
      take: CONVERT_USERS_BATCH_SIZE,
      skip: offset,
      transaction: false,
    });
  }

  private async convertAndInsertUsersPerBatch(
    users: MySQLUserEntity[],
  ): Promise<{ oldId: OldUserId; newId: NewUserId }[]> {
    const newUsersResults: { oldId: OldUserId; newId: NewUserId }[] = [];

    let newUsers: PgUserEntity[] = [];

    for (const user of users) {
      const newUser = await this.convertUser(user);
      newUsers.push(newUser);
    }

    newUsers = await this.pgUserRepository.save(newUsers, {
      transaction: false,
    });

    newUsers.forEach((newUser) => {
      newUsersResults.push({
        oldId: newUser.userIdv1,
        newId: newUser.id,
      });
    });

    return newUsersResults;
  }

  private async convertUser(user: MySQLUserEntity): Promise<PgUserEntity> {
    const newUser = new PgUserEntity();
    newUser.userIdv1 = user.id;
    newUser.email = user.email;
    newUser.authProvider = user.authProvider;
    newUser.username = user.username;
    newUser.cash = user.cash;
    newUser.submitAllowedMapStop = user.submitAllowedMapStop;
    newUser.isUserDiceTossForbidden = user.isUserDiceTossForbidden;
    newUser.canTossDiceAfter = user.canTossDiceAfter;
    newUser.countryCode3 = 'KOR';
    newUser.signupCompleted = user.signupCompleted;
    newUser.isTerminated = user.isTerminated;
    newUser.stockId = user.stockId;
    newUser.stockPrice = user.stockPrice;
    newUser.stockAmount = user.stockAmount;
    newUser.stockCashPurchaseSum = user.stockCashPurchaseSum;
    newUser.canAddLandComment = user.canAddLandComment;
    newUser.createdAt = user.createdAt;
    newUser.updatedAt = user.updatedAt;

    return newUser;
  }
}
