import { atom } from "recoil";

/**
 * 마지막으로 위치한 스킬 로그의 ID
 */
export const latestSkillLogIdState = atom({
  key: "latestSkillLogId",
  default: ""
});
