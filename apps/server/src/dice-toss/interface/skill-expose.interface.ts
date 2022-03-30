import { SkillRouteType } from '@packages/scenario-routing';
import { MessageResponseType, UserVo } from '@packages/shared-types';

export type ExposedSkillLogType = {
  skillDrawResult: MessageResponseType;
  skillRoute: SkillRouteType;
  id: string;
};

export class DiceTossOutputDto {
  user: UserVo;
  diceResult: number[];
  skillLog: ExposedSkillLogType;
}

export class UserInteractionOutputDto {
  user: UserVo;
  skillLog: ExposedSkillLogType;
}
