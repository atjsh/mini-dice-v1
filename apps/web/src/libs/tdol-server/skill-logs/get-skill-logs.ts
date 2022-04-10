import { SkillRouteType } from '@packages/scenario-routing';
import { MessageResponseType } from '@packages/shared-types';
import { authedAxios } from '..';

export type ExposedSkillLogType = {
  skillDrawResult: MessageResponseType;
  skillRoute: SkillRouteType;
  id: string;
};

export async function getSkillLogs(
  limit: number,
): Promise<ExposedSkillLogType[]> {
  const response = await authedAxios.get<ExposedSkillLogType[]>(
    '/recent-skill-logs',
    {
      params: {
        limit,
      },
    },
  );
  return response.data.reverse();
}
