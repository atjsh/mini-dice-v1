import {
  UserActivityMessageType,
  PlainMessageType,
  FormMessageType,
  LinkGroupType,
} from '@packages/shared-types';
import { ExposedSkillLogType } from '../../../libs';

export interface SkillLogMessageInerface {
  message:
    | UserActivityMessageType
    | PlainMessageType
    | FormMessageType
    | PlainMessageType[]
    | FormMessageType[]
    | LinkGroupType;

  date: Date;

  skillLogId: ExposedSkillLogType['id'];
}
