import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  getSkillGroupPath,
  getSkillRouteFromPath,
  SkillRoutePath,
} from '@packages/scenario-routing';
import { LandCommentVo, UserIdType } from '@packages/shared-types';
import { Repository } from 'typeorm';
import { SkillLogService } from '../skill-log/skill-log.service';
import { UserService } from '../user/user.service';
import { UserLandCommentEntity } from './entities/user-land-comment.entity';

@Injectable()
export class UserLandCommentService {
  constructor(
    private userService: UserService,

    @InjectRepository(UserLandCommentEntity)
    private userCommentRepository: Repository<UserLandCommentEntity>,

    private skillLogServicec: SkillLogService,
  ) {}

  private async isTicketExist(userId: UserIdType): Promise<boolean> {
    return (await this.userService.findUserWithCache(userId)) !== undefined;
  }

  private async expireTicket(userId: UserIdType) {
    await this.userService.partialUpdateUser(userId, {
      canAddLandComment: false,
    });
  }

  async setUserCanAddLandComment(userId: UserIdType, canAdd: boolean) {
    await this.userService.partialUpdateUser(userId, {
      canAddLandComment: canAdd,
    });
  }

  async registerComment(userId: UserIdType, comment: string) {
    if (!(await this.isTicketExist(userId))) {
      throw new Error('Ticket does not exist');
    }
    await this.expireTicket(userId);
    const landId = (await this.skillLogServicec.getLastLog(userId))?.skillRoute;

    if (landId) {
      const result = await this.userCommentRepository.save(
        this.userCommentRepository.create({
          userId,
          comment,
          landId: getSkillGroupPath(getSkillRouteFromPath(landId)),
        }),
        { reload: false },
      );

      return result;
    }

    throw new Error('No Last Land Log Available; Cannot add comment');
  }

  async getLandComments(landId: SkillRoutePath): Promise<LandCommentVo[]> {
    return (
      await this.userCommentRepository.find({
        relations: ['user'],
        where: { landId: getSkillGroupPath(getSkillRouteFromPath(landId)) },
        order: { date: 'DESC' },
        take: 20,
      })
    ).map((result) => ({
      username: result.user.username,
      comment: result.comment,
      date: result.date,
    }));
  }
}
