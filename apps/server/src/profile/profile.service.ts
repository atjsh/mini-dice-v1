import { Injectable } from '@nestjs/common';
import { PublicProfileVo, UserEntityJson } from '@packages/shared-types';
import { UserJwtDto } from '../auth/local-jwt/access-token/dto/user-jwt.dto';
import { serializeUserToJson } from '../user/entity/user.entity';
import { UserRepository } from '../user/user.repository';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class PublicProfileService {
  constructor(private userRepository: UserRepository) {}

  async getUser(userJwt: UserJwtDto): Promise<UserEntityJson> {
    return serializeUserToJson(
      await this.userRepository.findUserWithCache(userJwt.userId),
    );
  }

  async getUsers(limit: number, page: number): Promise<PublicProfileVo[]> {
    const rawUsers = await this.userRepository
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
      .skip(limit * (page - 1))
      .getRawMany();

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
