import { useState } from 'react';
import type { PasskeyListItemDto } from '@packages/shared-types';

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
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="text-2xl">{getDeviceIcon(passkey.deviceType)}</div>
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
              className="w-full px-2 py-1 border border-blue-500 rounded dark:bg-gray-800"
              autoFocus
              maxLength={100}
            />
          ) : (
            <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">
              {passkey.name}
            </div>
          )}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            등록: {formatDate(passkey.createdAt)} | 마지막 사용:{' '}
            {formatDate(passkey.lastUsedAt)}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            이름 변경
          </button>
        )}
        {showDeleteConfirm ? (
          <div className="flex gap-2">
            <button
              onClick={handleDeleteConfirm}
              className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              확인
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-3 py-1.5 text-sm bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              취소
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            삭제
          </button>
        )}
      </div>
    </div>
  );
}
