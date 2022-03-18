import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserJwtDto } from '../auth/local-jwt/access-token/dto/user-jwt.dto';
import { serializeUserToJson } from '../user/entity/user.entity';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class ProfileService {
  constructor(private usersService: UserRepository) {}

  async getUser(userJwt: UserJwtDto) {
    try {
      const rawUser = await this.usersService.findOneOrFail(userJwt.userId);

      return serializeUserToJson(rawUser);
    } catch (error) {
      throw new ForbiddenException('User not found');
    }
  }
}
