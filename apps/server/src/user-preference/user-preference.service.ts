import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type {
  UpdateUserPreferenceDto,
  UserIdType,
} from '@packages/shared-types';
import type { Repository } from 'typeorm';
import { UserPreferenceEntity } from './entity/user-preference.entity';

@Injectable()
export class UserPreferenceService {
  constructor(
    @InjectRepository(UserPreferenceEntity)
    private userPreferenceRepository: Repository<UserPreferenceEntity>,
  ) {}

  /**
   * Get user preference by user ID. Create if not exists.
   */
  async getUserPreference(userId: UserIdType): Promise<UserPreferenceEntity> {
    let preference = await this.userPreferenceRepository.findOne({
      where: {
        userId,
      },
    });

    if (!preference) {
      preference = await this.userPreferenceRepository.save(
        this.userPreferenceRepository.create({
          userId,
          alwaysHideComments: false,
        }),
      );
    }

    return preference;
  }

  /**
   * Update user preference
   */
  async updateUserPreference(
    userId: UserIdType,
    updateDto: UpdateUserPreferenceDto,
  ): Promise<UserPreferenceEntity> {
    const preference = await this.getUserPreference(userId);

    return await this.userPreferenceRepository.save({
      ...preference,
      ...updateDto,
    });
  }
}
