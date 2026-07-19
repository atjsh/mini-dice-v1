import { useState } from 'react';
import {
  usePasskeyList,
  usePasskeyRegister,
  usePasskeyDelete,
  usePasskeyRename,
} from '../../libs/tdol-server/passkey';
import { normalizePasskeyErrorMessage } from '../../libs/tdol-server/passkey/passkey-error-message';
import {
  SettingsActionButton,
  SettingsCard,
  SettingsHeader,
  SettingsNotice,
} from '../settings';
import { PasskeyItem } from './PasskeyItem';

export function PasskeyManagementSection() {
  const { data: passkeys, isLoading } = usePasskeyList();
  const registerMutation = usePasskeyRegister();
  const deleteMutation = usePasskeyDelete();
  const renameMutation = usePasskeyRename();
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const passkeysList = passkeys ?? [];

  const handleAddPasskey = async () => {
    try {
      setMessage(null);
      await registerMutation.mutateAsync(undefined);
      setMessage({
        type: 'success',
        text: '패스키가 성공적으로 추가되었습니다!',
      });
    } catch (error: any) {
      const errorMessage = normalizePasskeyErrorMessage(
        error,
        '패스키 등록에 실패했습니다. 브라우저 권한을 확인한 뒤 다시 시도해 주세요.',
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

  return (
    <SettingsCard>
      <SettingsHeader
        title="패스키 관리"
        description="패스키를 사용하면 비밀번호 없이 안전하게 로그인할 수 있습니다."
        className="mb-4"
      />

      {message && (
        <SettingsNotice tone={message.type} className="mb-4" role="status">
          {message.text}
        </SettingsNotice>
      )}

      {isLoading ? (
        <SettingsNotice tone="neutral" className="mb-4 text-center">
          로딩 중...
        </SettingsNotice>
      ) : passkeysList && passkeysList.length > 0 ? (
        <div className="space-y-3 mb-4">
          {passkeysList.map((passkey) => (
            <PasskeyItem
              key={passkey.id}
              passkey={passkey}
              onDelete={() => handleDeletePasskey(passkey.id)}
              onRename={(newName) => handleRenamePasskey(passkey.id, newName)}
            />
          ))}
        </div>
      ) : (
        <div className="mb-4 rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center text-gray-600 dark:border-zinc-700 dark:text-gray-400">
          <p className="text-lg mb-2">등록된 패스키가 없습니다</p>
          <p className="text-sm">
            패스키를 추가하면 더 쉽고 안전하게 로그인할 수 있습니다.
          </p>
        </div>
      )}

      <SettingsActionButton
        onClick={handleAddPasskey}
        disabled={registerMutation.isLoading}
        className="w-full py-3"
      >
        {registerMutation.isLoading ? '추가 중...' : '새 패스키 추가'}
      </SettingsActionButton>
    </SettingsCard>
  );
}
