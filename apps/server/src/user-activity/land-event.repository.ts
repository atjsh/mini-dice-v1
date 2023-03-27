import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserActivityEntity } from './user-activity.entity';

export type CreateUserActivityInputDto<
  LandEventResult extends Record<string, any>,
> = Pick<UserActivityEntity, 'skillRoute' | 'userId'> & {
  skillDrawProps: LandEventResult;
};

export type CreateUserActivityOutputDto = Pick<
  UserActivityEntity,
  'id' | 'skillDrawProps' | 'skillRoute' | 'userId' | 'createdAt'
>;

export type SearchUserActivityByDateInputDto = Pick<
  UserActivityEntity,
  'userId'
> & {
  createdAtFrom: Date;
  createdAtTo: Date;
};

export type SearchUserActivityByPageInputDto = Pick<
  UserActivityEntity,
  'userId'
> & {
  pageNo: number;
  pageSize: number;
};

export type SearchUserActivityOutputDto = Pick<
  UserActivityEntity,
  'id' | 'skillDrawProps' | 'skillRoute' | 'userId' | 'createdAt'
>;

@Injectable()
export class LandEventRepository {
  constructor(
    @InjectRepository(UserActivityEntity)
    private readonly userActivityRepository: Repository<UserActivityEntity>,
  ) {}

  public async createLandEvent<LandEventResult extends Record<string, any>>(
    createUserActivityInputDto: CreateUserActivityInputDto<LandEventResult>,
  ): Promise<CreateUserActivityOutputDto> {
    return await this.userActivityRepository.save(
      this.userActivityRepository.create({
        ...createUserActivityInputDto,
        read: false,
      }),
    );
  }

  async searchByPage(
    searchUserActivityByPageInputDto: SearchUserActivityByPageInputDto,
  ): Promise<SearchUserActivityOutputDto[]> {
    return await this.userActivityRepository.find({
      where: {
        userId: searchUserActivityByPageInputDto.userId,
      },
      take: searchUserActivityByPageInputDto.pageSize,
      skip:
        searchUserActivityByPageInputDto.pageSize *
        (searchUserActivityByPageInputDto.pageNo - 1),
    });
  }

  async searchByDate({
    userId,
    createdAtFrom,
    createdAtTo,
  }: SearchUserActivityByDateInputDto): Promise<SearchUserActivityOutputDto[]> {
    const date14daysAgo = new Date(
      createdAtFrom.getTime() - 14 * 24 * 60 * 60 * 1000,
    );
    return await this.userActivityRepository
      .createQueryBuilder('userActivity')
      .where('userActivity.userId = :userId', { userId })
      .andWhere('userActivity.createdAt >= :createdAtFrom', {
        createdAtFrom:
          createdAtFrom > date14daysAgo ? createdAtFrom : date14daysAgo,
      })
      .andWhere('userActivity.createdAt <= :createdAtTo', { createdAtTo })
      .orderBy('userActivity.createdAt', 'ASC')
      .getMany();
  }
}
