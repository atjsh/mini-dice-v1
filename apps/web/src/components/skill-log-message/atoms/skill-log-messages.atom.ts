import { atom } from 'recoil';
import { SkillLogMessageInerface } from '../interfaces/skill-log-message.interface';

export const skillLogMessagesState = atom<SkillLogMessageInerface[]>({
  key: 'skillLogMessageAtom',
  default: [],
});
