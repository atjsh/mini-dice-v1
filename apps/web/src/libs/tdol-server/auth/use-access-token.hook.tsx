import { useQuery } from 'react-query';
import { getUserAccessToken } from './access-token';
import { ReactQueryAccessTokenKey } from './constants';

export const useAccessToken = () =>
  useQuery(ReactQueryAccessTokenKey, getUserAccessToken, { retry: false });
