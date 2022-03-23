import { MessageResponseType, UserVo } from '@packages/shared-types';

export type ExposedSkillLogType = {
  skillDrawResult: MessageResponseType;
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
