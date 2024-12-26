import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { PublicProfileVo, UserEntityJson } from '@packages/shared-types';
import { randomUUID } from 'crypto';
import type { Repository } from 'typeorm';
import type { UserJwtDto } from '../auth/local-jwt/access-token/dto/user-jwt.dto';
import { UserEntity, serializeUserToJson } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';

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

      .orderBy('user.cash + user.stockAmount * user.stockPrice', 'DESC')
      .take(limit)
      .skip(limit * (page - 1));

    if (updatedAfter) {
      rawUsersQuery.andWhere('user.updatedAt > :updatedAt', {
        updatedAt: updatedAfter,
      });
    }
    const rawUsers = await rawUsersQuery.getRawMany();

    return rawUsers.map((rawResultUser) => ({
      id: randomUUID(),
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
