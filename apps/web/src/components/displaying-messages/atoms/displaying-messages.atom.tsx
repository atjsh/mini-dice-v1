import { atom } from "recoil";
import { ExposedSkillLogType } from "../../../libs";

export const exposedSkillLogsState = atom<ExposedSkillLogType[]>({
  key: "exposedSkillLogs",
  default: []
});

export const displayingMessagesState = atom<JSX.Element[]>({
  key: "displayingMessages",
  default: []
});
