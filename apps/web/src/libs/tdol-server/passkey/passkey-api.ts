import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/browser';
import axios, { type AxiosResponse } from 'axios';
import type {
  PasskeyListItemDto,
  PasskeyRegistrationResultDto,
} from '@packages/shared-types';
import { authedAxios } from '../auth/access-token';

interface ErrorResponseBody {
  message?: string;
}

interface SuccessResponseBody {
  success: true;
}

export interface PasskeyAuthenticationResult {
  success: true;
  isSignupFinished: boolean;
}

function isErrorResponseBody(value: unknown): value is ErrorResponseBody {
  return (
    typeof value === 'object' &&
    value !== null &&
    (!('message' in value) || typeof value.message === 'string')
  );
}

function throwIfRequestFailed(response: AxiosResponse<unknown>) {
  if (response.status !== 200 && response.status !== 201) {
    const message =
      (isErrorResponseBody(response.data)
        ? response.data.message
        : undefined) ||
      response.statusText ||
      '요청을 처리하지 못했습니다. 다시 시도해 주세요.';
    throw new Error(message);
  }
}

export async function getRegistrationOptions(): Promise<PublicKeyCredentialCreationOptionsJSON> {
  const response =
    await authedAxios.post<PublicKeyCredentialCreationOptionsJSON>(
      '/auth/passkey/register/options',
    );
  throwIfRequestFailed(response);
  return response.data;
}

export async function verifyRegistration(
  credential: RegistrationResponseJSON,
): Promise<PasskeyRegistrationResultDto> {
  const response = await authedAxios.post<PasskeyRegistrationResultDto>(
    '/auth/passkey/register/verify',
    { credential },
  );
  throwIfRequestFailed(response);
  return response.data;
}

export async function getAuthenticationOptions(): Promise<PublicKeyCredentialRequestOptionsJSON> {
  const response = await axios.post<PublicKeyCredentialRequestOptionsJSON>(
    `${import.meta.env.VITE_SERVER_URL}/auth/passkey/authenticate/options`,
    {},
  );
  return response.data;
}

export async function verifyAuthentication(
  credential: AuthenticationResponseJSON,
): Promise<PasskeyAuthenticationResult> {
  const response = await axios.post<PasskeyAuthenticationResult>(
    `${import.meta.env.VITE_SERVER_URL}/auth/passkey/authenticate/verify`,
    { credential },
    { withCredentials: true },
  );
  return response.data;
}

export async function listPasskeys(): Promise<PasskeyListItemDto[]> {
  const response =
    await authedAxios.get<PasskeyListItemDto[]>('/auth/passkey/list');
  throwIfRequestFailed(response);
  return response.data;
}

export async function deletePasskey(id: string): Promise<SuccessResponseBody> {
  const response = await authedAxios.delete<SuccessResponseBody>(
    `/auth/passkey/${id}`,
  );
  throwIfRequestFailed(response);
  return response.data;
}

export async function renamePasskey(
  id: string,
  name: string,
): Promise<SuccessResponseBody> {
  const response = await authedAxios.patch<SuccessResponseBody>(
    `/auth/passkey/${id}/rename`,
    { name },
  );
  throwIfRequestFailed(response);
  return response.data;
}
