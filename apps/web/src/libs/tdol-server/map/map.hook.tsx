import { useQuery } from '@tanstack/react-query';
import { getMap } from '.';

export const useMap = () =>
  useQuery({
    queryKey: [getMap.name],
    queryFn: getMap,
  });
