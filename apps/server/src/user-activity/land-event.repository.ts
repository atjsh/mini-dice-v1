import { EntityRepository, Repository } from 'typeorm';
import { UserActivityEntity } from './user-activity.entity';

export type CreateUserActivityInputDto<
  LandEventResult extends Record<string, any>,
> = Pick<UserActivityEntity, 'skillRoute' |'userId'> & {
  skillDrawProps: LandEventResult;
}

export type CreateUserActivityOutputDto = Pick<UserActivityEntity, 
  'id' |
  'skillDrawProps'|
  'skillRoute'|
  'userId'|
  'createdAt'
>;

export type SearchUserActivityByDateInputDto = Pick<
  UserActivityEntity,
  'userId'
>& {
  createdAtFrom: Date;
  createdAtTo: Date;
}

export type SearchUserActivityByPageInputDto = Pick<
  UserActivityEntity,
  'userId'
> & {
  pageNo: number;
  pageSize: number;
}

export type SearchUserActivityOutputDto = Pick<UserActivityEntity, 
  'id' |
  'skillDrawProps' |
  'skillRoute' |
  'userId' |
  'createdAt' 
>;

@EntityRepository(UserActivityEntity)
export class LandEventRepository extends Repository<UserActivityEntity> {
  public async createLandEvent<LandEventResult extends Record<string, any>>(
    createUserActivityInputDto: CreateUserActivityInputDto<LandEventResult>,
  ): Promise<CreateUserActivityOutputDto> {
    return await this.save(
      this.create({
        ...createUserActivityInputDto,
        read: false,
      }),
    );
  }

  async searchByPage(
    searchUserActivityByPageInputDto: SearchUserActivityByPageInputDto,
  ): Promise<SearchUserActivityOutputDto[]> {
    return await this.find({
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
    return await this.createQueryBuilder('userActivity')
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
