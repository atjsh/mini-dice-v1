import { useMutation } from "react-query";
import { useRecoilState } from "recoil";
import { tossDice } from ".";
import { UserProfile, UseUserHookKey, getLatestSkillRoute } from "..";
import { queryClient } from "../../..";
import { useDisplayingMessages } from "../../../components/displaying-messages/use-displaying-messages.hook";
import { latestSkillLogIdState } from "../skill-logs/atoms/latest-skill-log.atom";

export const useDiceToss = () => {
  const [skillLogId, setSkillLogId] = useRecoilState(latestSkillLogIdState);
  const { addExposedSkillLogs } = useDisplayingMessages();

  return useMutation(tossDice, {
    onSuccess: (data) => {
      addExposedSkillLogs([data.skillLog]);
      queryClient.setQueryData<UserProfile>(UseUserHookKey, data.user);
      queryClient.refetchQueries([getLatestSkillRoute.name]);
      setSkillLogId(data.skillLog.id);
    }
  });
};
