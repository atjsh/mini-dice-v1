import axios, { AxiosResponse } from 'axios';
import { ReactQueryAccessTokenKey } from './constants';
import { RefreshTokenNotFoundException } from './exceptions';

export type AccessTokenType = string;
const LocalStrageAccessTokenKey = ReactQueryAccessTokenKey;

export const authedAxios = axios.create({
  baseURL: process.env.SERVER_URL,
  validateStatus: () => true,
});

function isJwtTokenExpired(token: string) {
  const payloadBase64 = token.split('.')[1];
  const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
  const decoded = JSON.parse(decodedJson);
  const exp = decoded.exp;
  const expired = Date.now() >= exp * 1000;
  return expired;
}

async function getUserAccessTokenFromServer(): Promise<AccessTokenType> {
  try {
    const response = await axios.get<string>(`/auth/access-token`, {
      withCredentials: true,
      baseURL: process.env.SERVER_URL,
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
    isJwtTokenExpired(accessTokenFromLocalStorage) === false
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
    `${process.env.SERVER_URL}/auth/logout`,
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

  return config;
});
