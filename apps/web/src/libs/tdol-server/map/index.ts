import { authedAxios } from "..";
import { SkillRouteType } from "../../skill-draw-ui-ts/types";
export * from "./map.hook";

export class MapBlock {
  skillRoute: SkillRouteType;
  skillRouteUrl: string;
  alias: string;
}

export async function getMap() {
  return (await authedAxios.get<MapBlock[]>("/scenarios/dogdrip/map")).data;
}
