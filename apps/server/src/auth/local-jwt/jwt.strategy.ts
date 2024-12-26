import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Repository } from 'typeorm';
import { ENV_KEYS } from '../../config/enviorment-variable-config';
import { UserEntity } from '../../user/entity/user.entity';
import type { UserJwtDto } from './access-token/dto/user-jwt.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow(ENV_KEYS.JWT_SECRET),
    });
  }

  async validate(payload: UserJwtDto) {
    const user = await this.userRepository.findOne({
      select: ['isTerminated'],
      where: [
        {
          id: payload.userId,
        },
        {
          userIdv1: payload.userId,
        },
      ],
    });
    if (user == undefined || user?.isTerminated) {
      throw new ForbiddenException('User is terminated');
    }
    return { userId: payload.userId };
  }
}
