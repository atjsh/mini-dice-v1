import { authedAxios, ExposedSkillLogType, UserProfile } from "..";

export class DiceTossResult {
  user: UserProfile;
  diceResult: number[];
  skillLog: ExposedSkillLogType;
}

export async function tossDice() {
  const resposne = await authedAxios.post<DiceTossResult>("/dice-toss");
  return resposne.data;
}
