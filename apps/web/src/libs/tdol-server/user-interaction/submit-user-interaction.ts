import { AxiosResponse } from "axios";
import { authedAxios, ExposedSkillLogType, UserProfile } from "..";
import { SkillRouteType } from "../../skill-draw-ui-ts/types";

class UserInteractionDto {
  callingSkillRoute: SkillRouteType;
  callingSkillParam: Record<string, string>;
}

export class UserInteractionResult {
  user: UserProfile;
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
