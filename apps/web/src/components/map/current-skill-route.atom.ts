import { atom } from 'recoil';
import { SkillRouteType } from '../../libs';

export const currentSkillRouteAtom = atom<SkillRouteType | null>({
  key: 'currentSkillRouteAtom',
  default: null,
});
