import { authedAxios } from "..";
import { SkillRouteType } from "../../skill-draw-ui-ts/types";

export type CurrentSkillRoute = {
  skillRoute: SkillRouteType;
  id: string;
};

export async function getLatestSkillRoute() {
  const response = await authedAxios.get<CurrentSkillRoute>(
    "/recent-skill-logs/latest"
  );

  return response.data;
}
