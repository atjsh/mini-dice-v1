import { atom } from 'recoil';

export const displayingMessagesState = atom<JSX.Element[]>({
  key: 'displayingMessages',
  default: [],
});
