import { Injectable } from '@nestjs/common';
import { UserDataConvertorService } from './data-convertors/user.data-convertor.service';
import { SkillLogDataConvertorService } from './data-convertors/skill-log.data-convertor.service';
import { UserActivityDataConvertorService } from './data-convertors/user-activity.data-convertor.service';
import { LandDataConvertorService } from './data-convertors/land.data-convertor.service';
import { MoneyCollectionParticipantDataConvertorService } from './data-convertors/money-collection-participant.data-convertor.service';
import { RefreshTokenDataConvertorService } from './data-convertors/refresh-token.data-convertor.service';
import { UserLandCommentDataConvertor } from './data-convertors/user-land-comment.data-convertor.service';
import { IssueSpecificSkillLogDataConvertorService } from './issue-specific/skill-log.data-convertor.service';

@Injectable()
export class MigratorServicce {
  constructor(
    private readonly userDataConvertorService: UserDataConvertorService,

    private readonly skillLogDataConvertorService: SkillLogDataConvertorService,

    private readonly userActivityDataConvertorService: UserActivityDataConvertorService,

    private readonly moneyCollectionParticipantsDataConvertorService: MoneyCollectionParticipantDataConvertorService,
    private readonly landDataConvertorService: LandDataConvertorService,
    private readonly userLandCommentDataConvertor: UserLandCommentDataConvertor,

    private readonly refreshTokenDataConvertorService: RefreshTokenDataConvertorService,

    private readonly issueSpecificSkillLogDataConvertorService: IssueSpecificSkillLogDataConvertorService,
  ) {}

  public async migrateData() {
    // time the process
    console.time('Migration time');

    const convertedUsersMap =
      await this.userDataConvertorService.convertUsers();

    await this.skillLogDataConvertorService.convertSkillLogs(convertedUsersMap);

    await this.moneyCollectionParticipantsDataConvertorService.convertMoneyCollectionParticipants(
      convertedUsersMap,
    );
    await this.landDataConvertorService.convertLands(convertedUsersMap);
    await this.userLandCommentDataConvertor.convertUserLandComments(
      convertedUsersMap,
    );

    await this.userActivityDataConvertorService.convertUserActivities(
      convertedUsersMap,
    );

    await this.refreshTokenDataConvertorService.convertRefreshTokens(
      convertedUsersMap,
    );

    console.timeEnd('Migration time');
  }

  public async migrateIssueSpecificData() {
    await this.issueSpecificSkillLogDataConvertorService.convertSkillLogs();
  }
}
