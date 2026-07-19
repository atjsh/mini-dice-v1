import axios, { AxiosResponse } from 'axios';
import type {
  PasskeyListItemDto,
  PasskeyRegistrationResultDto,
} from '@packages/shared-types';
import { authedAxios } from '../auth/access-token';

function throwIfRequestFailed(response: any) {
  if (response.status !== 200 && response.status !== 201) {
    const message =
      response?.data?.message ||
      response?.statusText ||
      '요청을 처리하지 못했습니다. 다시 시도해 주세요.';
    throw new Error(message);
  }
}

export async function getRegistrationOptions() {
  const response = await authedAxios.post('/auth/passkey/register/options');
  throwIfRequestFailed(response);
  return response.data;
}

export async function verifyRegistration(
  credential: any,
): Promise<PasskeyRegistrationResultDto> {
  const response = await authedAxios.post<
    any,
    AxiosResponse<PasskeyRegistrationResultDto>
  >('/auth/passkey/register/verify', { credential });
  throwIfRequestFailed(response);
  return response.data;
}

export async function getAuthenticationOptions() {
  const response = await axios.post(
    `${import.meta.env.VITE_SERVER_URL}/auth/passkey/authenticate/options`,
    {},
  );
  return response.data;
}

export async function verifyAuthentication(credential: any) {
  const response = await axios.post(
    `${import.meta.env.VITE_SERVER_URL}/auth/passkey/authenticate/verify`,
    { credential },
    { withCredentials: true },
  );
  return response.data;
}

export async function listPasskeys(): Promise<PasskeyListItemDto[]> {
  const response = await authedAxios.get<PasskeyListItemDto[]>(
    '/auth/passkey/list',
  );
  throwIfRequestFailed(response);
  return response.data;
}

export async function deletePasskey(id: string) {
  const response = await authedAxios.delete(`/auth/passkey/${id}`);
  throwIfRequestFailed(response);
  return response.data;
}

export async function renamePasskey(id: string, name: string) {
  const response = await authedAxios.patch(`/auth/passkey/${id}/rename`, {
    name,
  });
  throwIfRequestFailed(response);
  return response.data;
}
