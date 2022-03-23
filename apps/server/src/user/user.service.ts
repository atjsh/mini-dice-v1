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
    if (user.submitAllowedMapStop == getSkillRoutePath(callingSkillRoute)) {
      return true;
    }
    return false;
  }

  async isUserCallingSkillAllowedOrThrow(
    userId: UserIdType,
    callingSkillRoute: SkillRouteType,
  ): Promise<boolean> {
    const user = await this.userRepository.findOneOrFail(userId);

    if (
      (await this.isUserCallingSkillAllowed(user, callingSkillRoute)) == false
    ) {
      throw new ForbiddenException(
        `${JSON.stringify(user.submitAllowedMapStop)} != ${JSON.stringify(
          callingSkillRoute,
        )} || ${JSON.stringify(user.submitAllowedMapStop)} != ${JSON.stringify(
          callingSkillRoute,
        )}`,
      );
    }

    return true;
  }
}
