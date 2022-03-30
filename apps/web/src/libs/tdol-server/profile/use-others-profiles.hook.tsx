import { useQuery } from 'react-query';
import { getOthersProfiles } from './user-profile';

export const useOthersProfiles = (limit: number, page: number) =>
  useQuery([getOthersProfiles.name, limit, page], () =>
    getOthersProfiles(limit, page),
  );
