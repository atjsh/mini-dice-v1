import { atom } from 'recoil';

export const diceTossButtonState = atom({
  key: 'diceTossButtonState',
  default: {
    isPending: false,
  },
});
