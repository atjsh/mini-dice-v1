import { atom } from 'recoil';
import { ExposedSkillLogType } from '../../../libs';

export const displayingMessagesState = atom<JSX.Element[]>({
  key: 'displayingMessages',
  default: [],
});
