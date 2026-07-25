import { Link } from 'react-router-dom';
import { PushNotificationSettings } from '../../components/push-notification';
import { ServiceLayout } from '../../layouts/service.layout';
import { PreferencesPageURL } from '../routes';

export function WebNotificationPreferencePage() {
  return (
    <ServiceLayout>
      <div className="self-center max-w-2xl m-auto">
        <div className="flex flex-col gap-2 mb-6">
          <Link
            className="text-lg text-blue-500 hover:underline"
            to={PreferencesPageURL}
          >
            ← 설정
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            푸시 알림
          </h1>
        </div>

        <PushNotificationSettings />
      </div>
    </ServiceLayout>
  );
}
