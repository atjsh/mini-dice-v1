import { PickType } from '@nestjs/swagger';
import { EntityRepository, Repository } from 'typeorm';
import { UserActivityEntity } from './user-activity.entity';

export class CreateUserActivityInputDto extends PickType(UserActivityEntity, [
  'skillDrawProps',
  'skillRoute',
  'userId',
]) {}

export class CreateUserActivityOutputDto extends PickType(UserActivityEntity, [
  'id',
  'skillDrawProps',
  'skillRoute',
  'userId',
  'createdAt',
]) {}

export class SearchUserActivityByDateInputDto extends PickType(
  UserActivityEntity,
  ['userId'],
) {
  createdAtFrom: Date;
  createdAtTo: Date;
}

export class SearchUserActivityByPageInputDto extends PickType(
  UserActivityEntity,
  ['userId'],
) {
  pageNo: number;
  pageSize: number;
}

export class SearchUserActivityOutputDto extends PickType(UserActivityEntity, [
  'id',
  'skillDrawProps',
  'skillRoute',
  'userId',
  'createdAt',
]) {}

@EntityRepository(UserActivityEntity)
export class LandEventRepository extends Repository<UserActivityEntity> {
  public async createLandEvent(
    createUserActivityInputDto: CreateUserActivityInputDto,
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
      .where('userActivity.createdAt >= :createdAtFrom', {
        createdAtFrom:
          createdAtFrom > date14daysAgo ? createdAtFrom : date14daysAgo,
      })
      .where('userActivity.createdAt <= :createdAtTo', { createdAtTo })
      .orderBy('userActivity.createdAt', 'ASC')
      .getMany();
  }
}
