import axios from 'axios';
import { ReactQueryAccessTokenKey } from './constants';
import { RefreshTokenNotFoundException } from './exceptions';

export type AccessTokenType = string;
const LocalStrageAccessTokenKey = ReactQueryAccessTokenKey;

export const authedAxios = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  validateStatus: () => true,
});

const TWO_MINUTES = 1000 * 60 * 2;

function hasJwtExpiration(value: unknown): value is { exp: number } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'exp' in value &&
    typeof value.exp === 'number'
  );
}

function isJwtTokenExpired(token: string): boolean {
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) {
      return true;
    }

    const decodedJson = atob(payloadBase64);
    const decoded: unknown = JSON.parse(decodedJson);
    if (!hasJwtExpiration(decoded)) {
      return true;
    }

    // exp * 1000 is date value. Refresh two minutes before expiration.
    return decoded.exp * 1000 < Date.now() + TWO_MINUTES;
  } catch {
    return true;
  }
}

async function getUserAccessTokenFromServer(): Promise<AccessTokenType> {
  try {
    const response = await axios.get<string>(`/auth/access-token`, {
      withCredentials: true,
      baseURL: import.meta.env.VITE_SERVER_URL,
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      throw new RefreshTokenNotFoundException('');
    }

    throw error;
  }
}

export function revokeUserAccessToken() {
  localStorage.removeItem(LocalStrageAccessTokenKey);
}

export async function getUserAccessToken(): Promise<AccessTokenType> {
  const accessTokenFromLocalStorage = localStorage.getItem(
    LocalStrageAccessTokenKey,
  );

  if (
    accessTokenFromLocalStorage &&
    !isJwtTokenExpired(accessTokenFromLocalStorage)
  ) {
    return accessTokenFromLocalStorage;
  } else {
    revokeUserAccessToken();
  }

  const accessTokenFromServer = await getUserAccessTokenFromServer();

  localStorage.setItem(LocalStrageAccessTokenKey, accessTokenFromServer);

  return accessTokenFromServer;
}

async function revokeUserRefreshToken() {
  const result = await axios.post<{ success: boolean }>(
    `${import.meta.env.VITE_SERVER_URL}/auth/logout`,
    {},
    { withCredentials: true },
  );
  return result.data;
}

export async function logoutUser() {
  revokeUserAccessToken();
  return revokeUserRefreshToken();
}

authedAxios.interceptors.request.use(async (config) => {
  const accessToken = await getUserAccessToken();

  config.headers.set('Authorization', `Bearer ${accessToken}`);
  config.headers.set(
    'timezone',
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

  return config;
});

authedAxios.interceptors.response.use((response) => {
  if (response.status != 200 && response.status != 201) {
    revokeUserAccessToken();
  }

  return response;
});
