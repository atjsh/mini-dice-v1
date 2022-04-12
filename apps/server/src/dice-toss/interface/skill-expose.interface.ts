import { SkillRouteType } from '@packages/scenario-routing';
import { MessageResponseType, UserEntityJson } from '@packages/shared-types';

export type ExposedSkillLogType = {
  skillDrawResult: MessageResponseType;
  skillRoute: SkillRouteType;
  id: string;
};

export class DiceTossOutputDto {
  user: UserEntityJson;
  diceResult: number[];
  skillLog: ExposedSkillLogType;
}

export class UserInteractionOutputDto {
  user: UserEntityJson;
  skillLog: ExposedSkillLogType;
}
