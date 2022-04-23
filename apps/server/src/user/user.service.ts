import { ForbiddenException, Injectable } from '@nestjs/common';
import { getSkillRoutePath, SkillRouteType } from '@packages/scenario-routing';
import { UserIdType } from '@packages/shared-types';
import { UserEntity } from './entity/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  private async isUserCallingSkillAllowed(
    user: UserEntity,
    callingSkillRoute: SkillRouteType,
  ) {
    return user.submitAllowedMapStop
      ?.split(',')
      .includes(getSkillRoutePath(callingSkillRoute));
  }

  async isUserCallingSkillAllowedOrThrow(
    userId: UserIdType,
    callingSkillRoute: SkillRouteType,
  ): Promise<boolean> {
    const user = await this.userRepository.findUserWithCache(userId);

    if (!(await this.isUserCallingSkillAllowed(user, callingSkillRoute))) {
      throw new ForbiddenException(
        `${JSON.stringify(user.submitAllowedMapStop)} not in ${JSON.stringify(
          callingSkillRoute,
        )} || ${JSON.stringify(
          user.submitAllowedMapStop,
        )} not in ${JSON.stringify(callingSkillRoute)}`,
      );
    }

    return true;
  }
}
