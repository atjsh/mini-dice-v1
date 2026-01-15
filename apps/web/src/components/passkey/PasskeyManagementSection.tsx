import { useState } from 'react';
import type { PasskeyListItemDto } from '@packages/shared-types';
import {
  usePasskeyList,
  usePasskeyRegister,
  usePasskeyDelete,
  usePasskeyRename,
} from '../../libs/tdol-server/passkey';
import { PasskeyItem } from './PasskeyItem';

export function PasskeyManagementSection() {
  const { data: passkeys, refetch, isLoading } = usePasskeyList();
  const registerMutation = usePasskeyRegister();
  const deleteMutation = usePasskeyDelete();
  const renameMutation = usePasskeyRename();
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const passkeysList = (passkeys || []) as PasskeyListItemDto[];

  const handleAddPasskey = async () => {
    try {
      setMessage(null);
      await registerMutation.mutateAsync(undefined);
      setMessage({ type: 'success', text: '패스키가 성공적으로 추가되었습니다!' });
      refetch();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        '패스키 추가에 실패했습니다.';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  const handleDeletePasskey = async (id: string) => {
    try {
      setMessage(null);
      await deleteMutation.mutateAsync(id);
      setMessage({ type: 'success', text: '패스키가 삭제되었습니다.' });
      refetch();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        '패스키 삭제에 실패했습니다.';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  const handleRenamePasskey = async (id: string, name: string) => {
    try {
      setMessage(null);
      await renameMutation.mutateAsync({ id, name });
      setMessage({ type: 'success', text: '패스키 이름이 변경되었습니다.' });
      refetch();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        '패스키 이름 변경에 실패했습니다.';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  return (
    <section className="border border-gray-300 dark:border-gray-600 rounded-xl p-6 bg-white dark:bg-zinc-800">
      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
        패스키 관리
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        패스키를 사용하면 비밀번호 없이 안전하게 로그인할 수 있습니다.
      </p>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === 'success'
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          로딩 중...
        </div>
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
        <div className="text-center py-8 text-gray-600 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg mb-4">
          <p className="text-lg mb-2">등록된 패스키가 없습니다</p>
          <p className="text-sm">
            패스키를 추가하면 더 쉽고 안전하게 로그인할 수 있습니다.
          </p>
        </div>
      )}

      <button
        onClick={handleAddPasskey}
        disabled={registerMutation.isLoading}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition duration-150"
      >
        {registerMutation.isLoading ? '추가 중...' : '🔑 새 패스키 추가'}
      </button>
    </section>
  );
}
