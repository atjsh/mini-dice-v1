import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { DATASOURCE_NAMES } from '../../common/datasource-names';
import { PgUserEntity } from '../../entities/postgresql/pg-user.entity';
import { SkillLogDataConvertorService } from '../data-convertors/skill-log.data-convertor.service';

type OldUserId = string;
type NewUserId = string; // uuid
export type ConvertedUsersMap = Record<OldUserId, NewUserId>;

@Injectable()
export class IssueSpecificSkillLogDataConvertorService {
  constructor(
    @InjectRepository(PgUserEntity, DATASOURCE_NAMES.POSTGRESQL)
    private readonly pgUserRepository: Repository<PgUserEntity>,

    private readonly skillLogDataConvertorService: SkillLogDataConvertorService,
  ) {}

  public async convertSkillLogs(): Promise<void> {
    const usersMap: ConvertedUsersMap = {};

    const pgUsers = await this.pgUserRepository.find({
      where: { userIdv1: Not(IsNull()) },
      transaction: false,
    });

    pgUsers.forEach((pgUser) => {
      usersMap[pgUser.userIdv1] = pgUser.id;
    });

    await this.skillLogDataConvertorService.convertSkillLogs(usersMap);
  }
}
