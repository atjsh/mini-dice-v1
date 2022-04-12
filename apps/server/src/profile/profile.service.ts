import { ForbiddenException, Injectable } from '@nestjs/common';
import { PublicProfileVo } from '@packages/shared-types';
import { UserJwtDto } from '../auth/local-jwt/access-token/dto/user-jwt.dto';
import { serializeUserToJson } from '../user/entity/user.entity';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class PublicProfileService {
  constructor(private userRepository: UserRepository) {}

  async getUser(userJwt: UserJwtDto, isMe: boolean): Promise<PublicProfileVo> {
    try {
      const rawUser = await this.userRepository.findOneOrFail(
        userJwt.userId,
        isMe == true
          ? undefined
          : {
              select: ['id', 'username', 'cash', 'createdAt'],
            },
      );

      return serializeUserToJson(rawUser);
    } catch (error) {
      throw new ForbiddenException('User not found');
    }
  }

  async getUsers(limit: number, page: number): Promise<PublicProfileVo[]> {
    const rawUsers = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.userId', 'user.username', 'user.createdAt'])
      .addSelect('user.cash + user.stockAmount * user.stockPrice', 'totalCash')
      .orderBy('totalCash', 'DESC')
      .take(limit)
      .skip(limit * (page - 1))
      .getRawMany();

    return rawUsers
      .map((rawResultUser) => ({
        id: rawResultUser.userId,
        username: rawResultUser.user_username,
        cash: rawResultUser.totalCash,
        createdAt: rawResultUser.user_createdAt,
      }))
      .map(serializeUserToJson);
  }
}
