import { useState } from 'react';
import {
  usePasskeyDelete,
  usePasskeyList,
  usePasskeyRegister,
  usePasskeyRename,
} from '../../libs/tdol-server/passkey';
import { normalizePasskeyErrorMessage } from '../../libs/tdol-server/passkey/passkey-error-message';
import {
  SettingsGroupedItem,
  SettingsGroupedList,
  SettingsNotice,
} from '../settings';
import { PasskeyItem } from '../passkey/PasskeyItem';
import type { AuthenticationMethodOption } from './AddAuthenticationMethodPopover';
import { AddAuthenticationMethodPopover } from './AddAuthenticationMethodPopover';
import type {
  AuthenticationUser,
  OAuthProviderDefinition,
} from './oauth-providers';
import { oauthProviders } from './oauth-providers';

function OAuthProviderItem({
  provider,
  user,
}: {
  provider: OAuthProviderDefinition;
  user: AuthenticationUser;
}) {
  const connectedEmail = provider.getConnectedEmail(user);

  if (connectedEmail === null) {
    return null;
  }

  return (
    <SettingsGroupedItem title={connectedEmail} subtitle={provider.label} />
  );
}

export function AuthenticationMethodsSection({
  user,
}: {
  user: AuthenticationUser;
}) {
  const { data: passkeys, isLoading } = usePasskeyList();
  const registerMutation = usePasskeyRegister();
  const deleteMutation = usePasskeyDelete();
  const renameMutation = usePasskeyRename();
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const passkeysList = passkeys ?? [];
  const connectedProviders = oauthProviders.filter((provider) =>
    provider.isConnected(user),
  );
  const availableProviders = oauthProviders.filter(
    (provider) => !provider.isConnected(user) && provider.isAvailable(user),
  );
  const hasAuthenticationMethods =
    connectedProviders.length > 0 || passkeysList.length > 0;

  const handleAddPasskey = async () => {
    try {
      setMessage(null);
      const result = await registerMutation.mutateAsync();

      if (result.namingOutcome === 'rename-failed') {
        setMessage({
          type: 'error',
          text: '패스키는 추가되었지만 이름을 저장하지 못했습니다. 관리 메뉴에서 다시 변경해 주세요.',
        });
      } else if (result.namingOutcome === 'default') {
        setMessage({
          type: 'success',
          text: '패스키가 추가되었습니다. 관리 메뉴에서 이름을 변경할 수 있습니다.',
        });
      } else {
        setMessage({
          type: 'success',
          text: '패스키가 성공적으로 추가되었습니다!',
        });
      }
    } catch (error: any) {
      const errorMessage = normalizePasskeyErrorMessage(
        error,
        '패스키 등록에 실패했습니다.',
      );
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  const handleDeletePasskey = async (id: string) => {
    try {
      setMessage(null);
      await deleteMutation.mutateAsync(id);
      setMessage({ type: 'success', text: '패스키가 삭제되었습니다.' });
    } catch (error: any) {
      const errorMessage = normalizePasskeyErrorMessage(
        error,
        '패스키 삭제에 실패했습니다. 다시 시도해 주세요.',
      );
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  const handleRenamePasskey = async (id: string, name: string) => {
    try {
      setMessage(null);
      await renameMutation.mutateAsync({ id, name });
      setMessage({ type: 'success', text: '패스키 이름이 변경되었습니다.' });
    } catch (error: any) {
      const errorMessage = normalizePasskeyErrorMessage(
        error,
        '패스키 이름 변경에 실패했습니다. 다시 시도해 주세요.',
      );
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  const addMethodOptions: AuthenticationMethodOption[] = [
    ...availableProviders.map(
      (provider): AuthenticationMethodOption => ({
        id: provider.id,
        kind: 'link',
        label: provider.label,
        description: provider.description,
        href: provider.getConnectionUrl(),
      }),
    ),
    {
      id: 'passkey',
      kind: 'button',
      label: '패스키',
      description: '기기 화면 잠금이나 보안 키를 사용해 로그인합니다.',
      onSelect: handleAddPasskey,
    },
  ];

  return (
    <section aria-labelledby="authentication-methods-heading">
      <div className="mb-4">
        <h2
          id="authentication-methods-heading"
          className="text-lg font-semibold leading-7 text-gray-900 dark:text-gray-100"
        >
          로그인 방법
        </h2>
        <p className="text-base leading-7 text-gray-600 dark:text-gray-400">
          프로필에 로그인할 방법을 관리합니다.
        </p>
      </div>

      {message && (
        <SettingsNotice
          tone={message.type}
          role={message.type === 'error' ? 'alert' : 'status'}
          aria-live="polite"
          className="mb-4"
        >
          {message.text}
        </SettingsNotice>
      )}

      <SettingsGroupedList aria-busy={isLoading}>
        {connectedProviders.map((provider) => (
          <OAuthProviderItem
            key={provider.id}
            provider={provider}
            user={user}
          />
        ))}
        {isLoading ? (
          <li className="flex min-h-[64px] items-center bg-gray-50 px-4 py-3 text-gray-500 first:rounded-t-xl last:rounded-b-xl dark:bg-zinc-900 dark:text-gray-400">
            <span className="animate-pulse text-sm motion-reduce:animate-none">
              패스키를 불러오는 중…
            </span>
          </li>
        ) : (
          passkeysList.map((passkey) => (
            <PasskeyItem
              key={passkey.id}
              passkey={passkey}
              onDelete={() => handleDeletePasskey(passkey.id)}
              onRename={(newName) => handleRenamePasskey(passkey.id, newName)}
            />
          ))
        )}
        {!isLoading && !hasAuthenticationMethods && (
          <li className="rounded-xl bg-gray-50 px-5 py-8 text-center dark:bg-zinc-900">
            <p className="font-medium text-gray-800 dark:text-gray-200">
              추가한 로그인 방법이 없습니다
            </p>
            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
              계정 연결이나 패스키를 추가해 안전하게 로그인하세요.
            </p>
          </li>
        )}
      </SettingsGroupedList>

      <div className="mt-4 flex justify-end">
        <AddAuthenticationMethodPopover
          options={addMethodOptions}
          isBusy={registerMutation.isLoading}
        />
      </div>
    </section>
  );
}
