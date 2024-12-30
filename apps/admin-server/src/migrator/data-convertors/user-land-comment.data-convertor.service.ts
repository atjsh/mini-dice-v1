import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DATASOURCE_NAMES } from '../../common/datasource-names';
import { MySQLUserLandCommentEntity } from '../../entities/mysql/mysql-user-land-comment.entity';
import { PgUserLandCommentEntity } from '../../entities/postgresql/pg-user-land-comment.entity';
import { ConvertedUsersMap } from './user.data-convertor.service';

const CONVERT_USER_LAND_COMMENT_BATCH_SIZE = 1000;

@Injectable()
export class UserLandCommentDataConvertor {
  constructor(
    @InjectRepository(MySQLUserLandCommentEntity, DATASOURCE_NAMES.MYSQL)
    private readonly mysqlUserLandCommentRepository: Repository<MySQLUserLandCommentEntity>,

    @InjectRepository(PgUserLandCommentEntity, DATASOURCE_NAMES.POSTGRESQL)
    private readonly pgUserLandCommentRepository: Repository<PgUserLandCommentEntity>,
  ) {}

  public async convertUserLandComments(convertedUsersMap: ConvertedUsersMap) {
    let offset = 0;

    const totalCount = await this.mysqlUserLandCommentRepository.count();

    while (offset < totalCount) {
      const userLandComments = await this.getUserLandCommentsBatch(offset);
      await this.convertAndInsertUserLandCommentsPerBatch(
        userLandComments,
        convertedUsersMap,
      );

      offset += CONVERT_USER_LAND_COMMENT_BATCH_SIZE;
    }
  }

  private async getUserLandCommentsBatch(offset: number) {
    return this.mysqlUserLandCommentRepository.find({
      take: CONVERT_USER_LAND_COMMENT_BATCH_SIZE,
      skip: offset,
      transaction: false,
    });
  }

  private async convertAndInsertUserLandCommentsPerBatch(
    userLandComments: MySQLUserLandCommentEntity[],
    convertedUsersMap: ConvertedUsersMap,
  ): Promise<void> {
    const newUserLandComments = userLandComments.map((userLandComment) =>
      this.convertUserLandComment(userLandComment, convertedUsersMap),
    );

    await this.pgUserLandCommentRepository.save(newUserLandComments, {
      transaction: false,
    });
  }

  private convertUserLandComment(
    userLandComment: MySQLUserLandCommentEntity,
    convertedUsersMap: ConvertedUsersMap,
  ): PgUserLandCommentEntity {
    const newUserLandComment = new PgUserLandCommentEntity();
    newUserLandComment.id = userLandComment.id;
    newUserLandComment.userId = convertedUsersMap[userLandComment.userId];
    newUserLandComment.landId = userLandComment.landId;
    newUserLandComment.comment = userLandComment.comment;
    newUserLandComment.createdAt = userLandComment.date;
    newUserLandComment.updatedAt = userLandComment.date;

    return newUserLandComment;
  }
}
