import React from 'react';
import { usePushNotifications } from '../../libs/push-notification';
import {
  SettingsCard,
  SettingsHeader,
  SettingsNotice,
  SettingsToggle,
} from '../settings';

interface PushNotificationSettingsProps {
  className?: string;
}

function getPushErrorMessage(error: string) {
  if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(error)) {
    return error;
  }

  if (/applicationServerKey|P-256|VAPID/i.test(error)) {
    return '푸시 알림 서버 키가 올바르지 않습니다. 잠시 후 다시 시도해 주세요.';
  }

  if (/permission denied|Notification permission denied/i.test(error)) {
    return '알림 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해 주세요.';
  }

  if (/ServiceWorker|service worker/i.test(error)) {
    return '푸시 알림 준비에 실패했습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.';
  }

  return '푸시 알림을 등록하지 못했습니다. 잠시 후 다시 시도해 주세요.';
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
      <SettingsCard className={className}>
        <p className="text-base leading-7 text-gray-600 dark:text-gray-400">
          푸시 알림이 이 브라우저에서 지원되지 않습니다.
        </p>
      </SettingsCard>
    );
  }

  return (
    <SettingsCard className={className}>
      <div className="flex items-center justify-between gap-5">
        <SettingsHeader
          title="푸시 알림"
          description="새로운 이벤트 발생 시 알림을 받습니다"
          className="flex-1"
        />
        <SettingsToggle
          checked={isSubscribed}
          onChange={handleToggle}
          disabled={isLoading || permission === 'denied'}
          ariaLabel="푸시 알림 토글"
        />
      </div>
      {permission === 'denied' && (
        <SettingsNotice
          tone="error"
          className="mt-4"
          role="alert"
          aria-live="polite"
        >
          알림 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.
        </SettingsNotice>
      )}
      {error && (
        <SettingsNotice
          tone="error"
          className="mt-4"
          role="alert"
          aria-live="polite"
        >
          오류: {getPushErrorMessage(error)}
        </SettingsNotice>
      )}
      {isLoading && (
        <SettingsNotice tone="neutral" className="mt-4">
          처리 중...
        </SettingsNotice>
      )}
      {isSubscribed && !isLoading && (
        <SettingsNotice tone="success" className="mt-4">
          푸시 알림이 활성화되었습니다
        </SettingsNotice>
      )}
    </SettingsCard>
  );
}
