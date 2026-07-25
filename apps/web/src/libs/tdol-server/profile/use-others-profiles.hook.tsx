import { useQuery } from '@tanstack/react-query';
import { getOthersProfiles } from './user-profile';

export const useOthersProfiles = (
  limit: number,
  page: number,
  updatedAfterOffset?: number,
) =>
  useQuery({
    queryKey: [
      getOthersProfiles.name,
      { limit, page, updatedAfterOffset },
    ] as const,
    queryFn: () => getOthersProfiles(limit, page, updatedAfterOffset),
  });
