import { atom } from 'recoil';

export enum DiceTossActivityEnum {
  // ready to dice toss, or waiting for diceTossUntil
  Idle,

  // Submitted
  Submitted,

  // just Tossed Dice, waiting for result
  Processing,

  // just Tossed Dice, brefily showing Dice Toss Result
  ResultShowing,
}

export const diceTossActivityStatusAtom = atom<{
  enum: DiceTossActivityEnum;
  reason: string | null;
}>({
  key: 'diceTossActivity',
  default: {
    enum: DiceTossActivityEnum.Idle,
    reason: null,
  },
});
