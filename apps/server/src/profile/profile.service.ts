import { Injectable } from '@nestjs/common';
import { PublicProfileVo, UserEntityJson } from '@packages/shared-types';
import { UserJwtDto } from '../auth/local-jwt/access-token/dto/user-jwt.dto';
import { serializeUserToJson, UserEntity } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { v4 as uuid4 } from 'uuid';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PublicProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private userService: UserService,
  ) {}

  async getUser(userJwt: UserJwtDto): Promise<UserEntityJson> {
    return serializeUserToJson(
      await this.userService.findUserWithCache(userJwt.userId),
    );
  }

  async getUsers(
    limit: number,
    page: number,
    updatedAfter?: Date,
  ): Promise<PublicProfileVo[]> {
    const rawUsersQuery = this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.userId',
        'user.username',
        'user.createdAt',
        'user.updatedAt',
        'user.stockAmount',
        'user.stockPrice',
      ])
      .addSelect('user.cash + user.stockAmount * user.stockPrice', 'totalCash')
      .addSelect(
        'row_number () over (order by user.cash + user.stockAmount * user.stockPrice desc)',
        'rank',
      )
      .where('user.isTerminated = :isTerminated', { isTerminated: false })

      .orderBy('totalCash', 'DESC')
      .take(limit)
      .skip(limit * (page - 1));

    if (updatedAfter) {
      rawUsersQuery.andWhere('user.updatedAt > :updatedAt', {
        updatedAt: updatedAfter,
      });
    }
    const rawUsers = await rawUsersQuery.getRawMany();

    return rawUsers.map((rawResultUser) => ({
      id: uuid4(),
      username: rawResultUser.user_username,
      cash: rawResultUser.totalCash,
      createdAt: rawResultUser.user_createdAt,
      rank: rawResultUser.rank,
      stockCash: String(
        rawResultUser.user_stockAmount * rawResultUser.user_stockPrice,
      ),
      updatedAt: rawResultUser.user_updatedAt,
    }));
  }
}
