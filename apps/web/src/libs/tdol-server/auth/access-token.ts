import axios, { AxiosResponse } from 'axios';
import { ReactQueryAccessTokenKey } from './constants';
import { RefreshTokenNotFoundException } from './exceptions';

export type AccessTokenType = string;
const LocalStrageAccessTokenKey = ReactQueryAccessTokenKey;

export const authedAxios = axios.create({
  baseURL: process.env.SERVER_URL,
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
    console.log('used', accessTokenFromLocalStorage);

    return accessTokenFromLocalStorage;
  } else {
    console.log('revoked', accessTokenFromLocalStorage);

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
  console.log(accessToken);

  config.headers.Authorization = `Bearer ${accessToken}`;

  config.headers.TimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return config;
});

authedAxios.interceptors.response.use(async (response) => {
  if (response.status != 200 && response.status != 201) {
    try {
      const accessToken = await getUserAccessToken();
      await axios.post(
        `${process.env.SERVER_URL}/frontend-error`,
        {
          error: JSON.stringify({
            status: response.status,
            statusText: response.statusText,
            data: response.data,
          }),
        },
        {
          validateStatus: () => true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    } catch (error) {
      console.error(error);
      // alert(
      //   `죄송합니다. 에러가 발생했습니다. 다음 텍스트를 복사해서 디스코드 채널에 제보해주시면 에러 해결에 도움이 됩니다. || ${JSON.stringify(
      //     {
      //       status: response.status,
      //       statusText: response.statusText,
      //       data: response.data,
      //     },
      //   )}`,
      // );
    }
  }

  return response;
});
