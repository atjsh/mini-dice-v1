import { authedAxios } from "..";
import { MessageResponseType } from "../../skill-draw-ui-ts/types";

export type ExposedSkillLogType = {
  skillDrawResult: MessageResponseType;
  id: string;
};

export async function getSkillLogs(
  limit: number
): Promise<ExposedSkillLogType[]> {
  const response = await authedAxios.get<ExposedSkillLogType[]>(
    "/recent-skill-logs",
    {
      params: {
        limit
      }
    }
  );
  return response.data.reverse();
}
