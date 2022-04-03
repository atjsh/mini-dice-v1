import {
  ExposedSkillLogType,
  FormMessageType,
  LinkGroupType,
  PlainMessageType,
  UserActivityMessageType,
} from '../../../libs';

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
