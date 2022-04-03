import { UserVo } from "@packages/shared-types";
import { authedAxios, ExposedSkillLogType } from "..";

export class DiceTossResult {
  user: UserVo;
  diceResult: number[];
  skillLog: ExposedSkillLogType;
}

export async function tossDice() {
  const resposne = await authedAxios.post<DiceTossResult>("/dice-toss");
  return resposne.data;
}
