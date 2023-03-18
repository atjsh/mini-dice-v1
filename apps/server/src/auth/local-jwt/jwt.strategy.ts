import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Repository } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import type { UserJwtDto } from './access-token/dto/user-jwt.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: UserJwtDto) {
    const user = await this.userRepository.findOne({
      select: ['isTerminated'],
      where: {
        id: payload.userId,
      },
    });
    if (user == undefined || user?.isTerminated) {
      throw new ForbiddenException('User is terminated');
    }
    return { userId: payload.userId };
  }
}
