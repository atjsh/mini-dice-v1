import { SkillRouteType } from '@packages/scenario-routing';
import { atom } from 'jotai';

export const currentSkillRouteAtom = atom<SkillRouteType | null | undefined>(
  undefined,
);
