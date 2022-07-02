import {
  UserActivityMessageType,
  PlainMessageType,
  FormMessageType,
  LinkGroupType,
  LandCommentVo,
  LandCommentsMessageType,
} from '@packages/shared-types';
import { ExposedSkillLogType } from '../../../libs';

export interface SkillLogMessageInerface {
  message:
    | UserActivityMessageType
    | PlainMessageType
    | FormMessageType
    | PlainMessageType[]
    | FormMessageType[]
    | LinkGroupType
    | LandCommentsMessageType;

  date: Date;

  skillLogId: ExposedSkillLogType['id'];
}
