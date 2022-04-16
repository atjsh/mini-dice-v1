import { ForbiddenException, Injectable } from '@nestjs/common';
import { PublicProfileVo, UserEntityJson } from '@packages/shared-types';
import { UserJwtDto } from '../auth/local-jwt/access-token/dto/user-jwt.dto';
import { serializeUserToJson } from '../user/entity/user.entity';
import { UserRepository } from '../user/user.repository';

function removePrefix(str: string, prefix: string) {
  return str.startsWith(prefix) ? str.substring(prefix.length) : str;
}

function removePrefixFromObjectKeys<Return>(obj: any, prefix: string): Return {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    newObj[removePrefix(key, prefix)] = obj[key];
  });
  return newObj as Return;
}

function pickKeysFromObjectKeys<Return>(obj: any, keys: string[]): Return {
  const newObj = {};
  keys.forEach((key) => {
    newObj[key] = obj[key];
  });
  return newObj as Return;
}

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
      .select(['user.userId', 'user.username', 'user.createdAt'])
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
      id: rawResultUser.userId,
      username: rawResultUser.user_username,
      cash: rawResultUser.totalCash,
      createdAt: rawResultUser.user_createdAt,
      rank: rawResultUser.rank,
    }));
  }
}
