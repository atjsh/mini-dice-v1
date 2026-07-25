import { useQuery } from '@tanstack/react-query';
import { getUserAccessToken } from './access-token';
import { ReactQueryAccessTokenKey } from './constants';

export const useAccessToken = () =>
  useQuery({
    queryKey: [ReactQueryAccessTokenKey],
    queryFn: getUserAccessToken,
    retry: false,
  });
