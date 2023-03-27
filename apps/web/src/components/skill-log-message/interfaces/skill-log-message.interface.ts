import {
  FormMessageType,
  LandCommentsMessageType,
  LinkGroupType,
  PlainMessageType,
  UserActivityMessageType,
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
