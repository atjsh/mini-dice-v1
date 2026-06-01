import {
  startAuthentication,
  startRegistration,
} from '@simplewebauthn/browser';

export interface Admin {
  id: string;
  displayName: string;
  role: string;
}

export const API_BASE =
  import.meta.env.VITE_ADMIN_API_URL ?? 'http://127.0.0.1:3020';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json.message ?? '요청에 실패했습니다.');
  }
  return json as T;
}

export const api = {
  me: () => request<{ admin: Admin }>('/admin/me'),
  logout: () => request<{ success: true }>('/admin/auth/logout', { method: 'POST' }),
  async join(input: { inviteToken: string; displayName: string }) {
    const options = await request<any>('/admin/auth/join/options', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    const credential = await startRegistration(options);
    return request<{ success: true }>('/admin/auth/join/verify', {
      method: 'POST',
      body: JSON.stringify({ challengeId: options.challengeId, credential }),
    });
  },
  async login() {
    const options = await request<any>('/admin/auth/login/options', {
      method: 'POST',
      body: '{}',
    });
    const credential = await startAuthentication(options);
    return request<{ success: true }>('/admin/auth/login/verify', {
      method: 'POST',
      body: JSON.stringify({ challengeId: options.challengeId, credential }),
    });
  },
  list: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
