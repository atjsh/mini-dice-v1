import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { latestSkillLogIdState } from "./atoms/latest-skill-log.atom";
import { getLatestSkillRoute } from "./get-latest-skill-route";

export const useLatestSkillLog = () => {
  const [skillLogId, setSkillLogId] = useRecoilState(latestSkillLogIdState);

  const mutation = useQuery(getLatestSkillRoute.name, getLatestSkillRoute, {
    retry: false,
    onSuccess: (data) => {
      setSkillLogId(data.id);
    }
  });

  return mutation;
};
