import type { UserEntityJson } from '@packages/shared-types';
import { getGoogleOAuthPageUrl } from '../../google-oauth';

export type AuthenticationUser = Pick<UserEntityJson, 'authProvider'> & {
  email: string | null;
};

export interface OAuthProviderDefinition {
  id: string;
  label: string;
  description: string;
  getConnectionUrl: () => string;
  getConnectedEmail: (user: AuthenticationUser) => string | null;
  isConnected: (user: AuthenticationUser) => boolean;
  isAvailable: (user: AuthenticationUser) => boolean;
}

function getGoogleConnectedEmail(user: AuthenticationUser) {
  return user.authProvider === 'google' ? user.email : null;
}

export const oauthProviders: OAuthProviderDefinition[] = [
  {
    id: 'google',
    label: 'Google',
    description: 'Google 계정을 연결해 로그인합니다.',
    getConnectionUrl: getGoogleOAuthPageUrl,
    getConnectedEmail: getGoogleConnectedEmail,
    isConnected: (user) => getGoogleConnectedEmail(user) != null,
    // The current server stores only one OAuth provider per user.
    isAvailable: (user) => user.email == null,
  },
];
