import axios, { AxiosResponse } from 'axios';
import { ReactQueryAccessTokenKey } from './constants';
import { RefreshTokenNotFoundException } from './exceptions';

export type AccessTokenType = string;
const LocalStrageAccessTokenKey = ReactQueryAccessTokenKey;

export const authedAxios = axios.create({
  baseURL: import.meta.env.SERVER_URL,
  validateStatus: () => true,
});

const TWO_MINUTES = 1000 * 60 * 2;

function isJwtTokenExpired(token: string) {
  const payloadBase64 = token.split('.')[1];
  const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
  const decoded = JSON.parse(decodedJson);
  const exp = decoded.exp;

  // exp * 1000 is date value
  // if exp is less then 2 minutes from now, it is expired
  return exp * 1000 < Date.now() + TWO_MINUTES;
}

async function getUserAccessTokenFromServer(): Promise<AccessTokenType> {
  try {
    const response = await axios.get<string>(`/auth/access-token`, {
      withCredentials: true,
      baseURL: import.meta.env.SERVER_URL,
    });

    return response.data;
  } catch (error: any) {
    if (error.response.status == 403) {
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
  const result = await axios.post<any, AxiosResponse<{ success: boolean }>>(
    `${import.meta.env.SERVER_URL}/auth/logout`,
    {},
    { withCredentials: true },
  );
  return result.data;
}

export async function logoutUser() {
  revokeUserAccessToken();
  return await revokeUserRefreshToken();
}

authedAxios.interceptors.request.use(async (config: any) => {
  const accessToken = await getUserAccessToken();

  config.headers.Authorization = `Bearer ${accessToken}`;

  config.headers.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return config;
});

authedAxios.interceptors.response.use(async (response) => {
  if (response.status != 200 && response.status != 201) {
    revokeUserAccessToken();
  }

  return response;
});
