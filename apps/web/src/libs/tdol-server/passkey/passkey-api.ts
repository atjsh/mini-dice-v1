import axios from 'axios';
import { authedAxios } from '../auth/access-token';

function throwIfRequestFailed(response: any) {
  if (response.status !== 200 && response.status !== 201) {
    const message =
      response?.data?.message || response?.statusText || 'Request failed';
    throw new Error(message);
  }
}

export async function getRegistrationOptions() {
  const response = await authedAxios.post('/auth/passkey/register/options');
  throwIfRequestFailed(response);
  return response.data;
}

export async function verifyRegistration(credential: any, name?: string) {
  const response = await authedAxios.post('/auth/passkey/register/verify', {
    credential,
    name,
  });
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

export async function verifyAuthentication(
  challengeId: string,
  credential: any,
) {
  const response = await axios.post(
    `${import.meta.env.VITE_SERVER_URL}/auth/passkey/authenticate/verify`,
    { challengeId, credential },
    { withCredentials: true },
  );
  return response.data;
}

export async function listPasskeys() {
  const response = await authedAxios.get('/auth/passkey/list');
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
