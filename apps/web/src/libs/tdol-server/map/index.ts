import { SkillRouteType } from '@packages/scenario-routing';
import { authedAxios } from '..';
export * from './map.hook';

export class MapBlock {
  skillRoute: SkillRouteType;
  skillRouteUrl: string;
  alias: string;
}

export async function getMap() {
  return (await authedAxios.get<MapBlock[]>('/scenarios/d1/map')).data;
}
