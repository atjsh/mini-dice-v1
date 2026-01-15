import React from 'react';
import { usePushNotifications } from '../../libs/push-notification';

interface PushNotificationSettingsProps {
  className?: string;
}

export function PushNotificationSettings({
  className = '',
}: PushNotificationSettingsProps) {
  const {
    isSupported,
    isSubscribed,
    isLoading,
    permission,
    subscribe,
    unsubscribe,
    error,
  } = usePushNotifications();

  const handleToggle = async () => {
    try {
      if (isSubscribed) {
        await unsubscribe();
      } else {
        await subscribe();
      }
    } catch (err) {
      console.error('Error toggling push notifications:', err);
    }
  };

  if (!isSupported) {
    return (
      <div className={`p-4 bg-gray-100 rounded-lg ${className}`}>
        <p className="text-sm text-gray-600">
          푸시 알림이 이 브라우저에서 지원되지 않습니다.
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-white rounded-lg border ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">푸시 알림</h3>
          <p className="text-sm text-gray-600">
            새로운 이벤트 발생 시 알림을 받습니다
          </p>
          {permission === 'denied' && (
            <p className="text-sm text-red-600 mt-2" role="alert" aria-live="polite">
              알림 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.
            </p>
          )}
          {error && (
            <p className="text-sm text-red-600 mt-2" role="alert" aria-live="polite">
              오류: {error}
            </p>
          )}
        </div>
        <div className="ml-4">
          <button
            onClick={handleToggle}
            disabled={isLoading || permission === 'denied'}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full
              transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${
                isSubscribed
                  ? 'bg-blue-600'
                  : 'bg-gray-200'
              }
              ${
                isLoading || permission === 'denied'
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              }
            `}
            aria-label="푸시 알림 토글"
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${isSubscribed ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
        </div>
      </div>
      {isLoading && (
        <p className="text-sm text-gray-500 mt-2">
          처리 중...
        </p>
      )}
      {isSubscribed && !isLoading && (
        <p className="text-sm text-green-600 mt-2">
          ✓ 푸시 알림이 활성화되었습니다
        </p>
      )}
    </div>
  );
}
