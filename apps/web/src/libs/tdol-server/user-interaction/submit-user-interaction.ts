import { UserVo } from "@packages/shared-types";
import { AxiosResponse } from "axios";
import { authedAxios, ExposedSkillLogType } from "..";

class UserInteractionDto {
  callingSkillRoute: string;
  callingSkillParam: Record<string, string>;
}

export class UserInteractionResult {
  user: UserVo;
  skillLog: ExposedSkillLogType;
}

export async function submitUserInteraction(
  dto: UserInteractionDto
): Promise<UserInteractionResult> {
  try {
    const response = await authedAxios.post<
      UserInteractionDto,
      AxiosResponse<UserInteractionResult>
    >("/user-interaction-web", dto);

    return response.data;
  } catch (error) {
    throw error;
  }
}
