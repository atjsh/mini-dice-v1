import { useQuery } from 'react-query';
import { getOthersProfiles } from './user-profile';

export const useOthersProfiles = (
  limit: number,
  page: number,
  updatedAfterOffset?: number,
) =>
  useQuery([getOthersProfiles.name, { limit, page, updatedAfterOffset }], () =>
    getOthersProfiles(limit, page, updatedAfterOffset),
  );
