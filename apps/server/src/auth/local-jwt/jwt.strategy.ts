import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UserJwtDto } from './access-token/dto/user-jwt.dto';
import { UserRepository } from '../../user/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: UserJwtDto) {
    const user = await this.userRepository.findOneOrFail(payload.userId, {
      select: ['isTerminated'],
    });
    if (user.isTerminated) {
      throw new ForbiddenException('User is terminated');
    }
    return { userId: payload.userId };
  }
}
