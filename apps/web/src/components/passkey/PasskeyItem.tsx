import { useState } from 'react';
import type { PasskeyListItemDto } from '@packages/shared-types';
import { SettingsActionButton } from '../settings';

interface PasskeyItemProps {
  passkey: PasskeyListItemDto;
  onDelete: () => void;
  onRename: (newName: string) => void;
}

export function PasskeyItem({ passkey, onDelete, onRename }: PasskeyItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(passkey.name);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleRenameSubmit = () => {
    if (editedName.trim() && editedName !== passkey.name) {
      onRename(editedName);
    }
    setIsEditing(false);
  };

  const handleDeleteConfirm = () => {
    onDelete();
    setShowDeleteConfirm(false);
  };

  const getDeviceIcon = (deviceType: string | null) => {
    if (deviceType === 'platform') {
      return '📱';
    } else if (deviceType === 'cross-platform') {
      return '🔑';
    }
    return '🔐';
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '사용 안 함';
    return new Date(date).toLocaleDateString('ko-kr', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-wrap items-start justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex items-start gap-3 flex-1 basis-72 min-w-0">
        <div className="text-2xl shrink-0">
          {getDeviceIcon(passkey.deviceType)}
        </div>
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameSubmit();
                if (e.key === 'Escape') {
                  setEditedName(passkey.name);
                  setIsEditing(false);
                }
              }}
              className="w-full rounded-lg border border-blue-500 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-gray-100"
              autoFocus
              maxLength={100}
            />
          ) : (
            <div className="font-semibold text-gray-900 dark:text-gray-100 break-all whitespace-normal">
              {passkey.name}
            </div>
          )}
          <div className="text-sm text-gray-500 dark:text-gray-400 break-words">
            등록: {formatDate(passkey.createdAt)} | 마지막 사용:{' '}
            {formatDate(passkey.lastUsedAt)}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2 ml-auto">
        {!isEditing && (
          <SettingsActionButton
            onClick={() => setIsEditing(true)}
            variant="ghost"
            className="px-3 py-1.5 text-sm"
          >
            이름 변경
          </SettingsActionButton>
        )}
        {showDeleteConfirm ? (
          <div className="flex flex-wrap justify-end gap-2">
            <SettingsActionButton
              onClick={handleDeleteConfirm}
              variant="danger"
              className="px-3 py-1.5 text-sm"
            >
              확인
            </SettingsActionButton>
            <SettingsActionButton
              onClick={() => setShowDeleteConfirm(false)}
              variant="secondary"
              className="px-3 py-1.5 text-sm"
            >
              취소
            </SettingsActionButton>
          </div>
        ) : (
          <SettingsActionButton
            onClick={() => setShowDeleteConfirm(true)}
            variant="dangerGhost"
            className="px-3 py-1.5 text-sm"
          >
            삭제
          </SettingsActionButton>
        )}
      </div>
    </div>
  );
}
