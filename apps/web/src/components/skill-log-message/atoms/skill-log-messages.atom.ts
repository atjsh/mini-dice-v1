import { atom } from 'jotai';
import { SkillLogMessageInerface } from '../interfaces/skill-log-message.interface';

export const skillLogMessagesState = atom<SkillLogMessageInerface[]>([]);
