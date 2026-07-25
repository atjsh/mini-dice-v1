import {
  startAuthentication,
  startRegistration,
  type PublicKeyCredentialCreationOptionsJSON,
  type PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/browser';
import type { AdminDto, SuccessResponse } from './dto';

const configuredApiBase: unknown = import.meta.env.VITE_ADMIN_API_URL;

export const API_BASE =
  typeof configuredApiBase === 'string'
    ? configuredApiBase
    : 'http://127.0.0.1:3020';

type AdminRegistrationOptions = PublicKeyCredentialCreationOptionsJSON & {
  challengeId: string;
};

type AdminAuthenticationOptions = PublicKeyCredentialRequestOptionsJSON & {
  challengeId: string;
};

function errorMessage(value: unknown): string | undefined {
  if (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof value.message === 'string'
  ) {
    return value.message;
  }
  return undefined;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });
  let json: unknown = {};
  try {
    json = await response.json();
  } catch {
    // Keep the empty-body fallback so status errors retain the existing message.
  }
  if (!response.ok) {
    throw new Error(errorMessage(json) ?? '요청에 실패했습니다.');
  }
  // This is the single generic success boundary for the typed admin API.
  return json as T;
}

export const api = {
  me: () => request<{ admin: AdminDto }>('/admin/me'),
  logout: () =>
    request<SuccessResponse>('/admin/auth/logout', { method: 'POST' }),
  async join(input: { inviteToken: string; displayName: string }) {
    const options = await request<AdminRegistrationOptions>(
      '/admin/auth/join/options',
      {
        method: 'POST',
        body: JSON.stringify(input),
      },
    );
    const { challengeId, ...optionsJSON } = options;
    const credential = await startRegistration({ optionsJSON });
    return request<SuccessResponse>('/admin/auth/join/verify', {
      method: 'POST',
      body: JSON.stringify({ challengeId, credential }),
    });
  },
  async login() {
    const options = await request<AdminAuthenticationOptions>(
      '/admin/auth/login/options',
      {
        method: 'POST',
        body: '{}',
      },
    );
    const { challengeId, ...optionsJSON } = options;
    const credential = await startAuthentication({ optionsJSON });
    return request<SuccessResponse>('/admin/auth/login/verify', {
      method: 'POST',
      body: JSON.stringify({ challengeId, credential }),
    });
  },
  list: <T>(path: string) => request<T>(path),
  post: <T = SuccessResponse>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}) }),
  patch: <T = SuccessResponse>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T = SuccessResponse>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
};
