import { atom } from 'recoil';
import { SkillRouteType } from '@packages/scenario-routing';

export const currentSkillRouteAtom = atom<SkillRouteType | null | undefined>({
  key: 'currentSkillRouteAtom',
  default: undefined,
});
