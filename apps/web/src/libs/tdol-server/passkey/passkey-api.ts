import axios from 'axios';
import { authedAxios } from '../auth/access-token';

export async function getRegistrationOptions() {
  const response = await authedAxios.post('/auth/passkey/register/options');
  return response.data;
}

export async function verifyRegistration(credential: any, name?: string) {
  const response = await authedAxios.post('/auth/passkey/register/verify', {
    credential,
    name,
  });
  return response.data;
}

export async function getAuthenticationOptions() {
  const response = await axios.post(
    `${import.meta.env.VITE_SERVER_URL}/auth/passkey/authenticate/options`,
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
  return response.data;
}

export async function deletePasskey(id: string) {
  const response = await authedAxios.delete(`/auth/passkey/${id}`);
  return response.data;
}

export async function renamePasskey(id: string, name: string) {
  const response = await authedAxios.patch(`/auth/passkey/${id}/rename`, {
    name,
  });
  return response.data;
}
