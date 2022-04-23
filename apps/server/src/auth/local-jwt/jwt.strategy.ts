import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserJwtDto } from './access-token/dto/user-jwt.dto';
import { UserRepository } from '../../user/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: UserJwtDto) {
    const user = await this.userRepository.findOne(payload.userId, {
      select: ['isTerminated'],
    });
    if (user == undefined || user?.isTerminated) {
      throw new ForbiddenException('User is terminated');
    }
    return { userId: payload.userId };
  }
}
