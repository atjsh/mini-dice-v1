import { Link } from 'react-router-dom';
import { ServiceLayout } from '../layouts/service.layout';
import { PushNotificationSettings } from '../components/push-notification';
import { IndexPageURL } from './routes';

export function UserPreferencePage() {
  return (
    <ServiceLayout>
      <div className="self-center max-w-lg m-auto">
        <div className="flex flex-col gap-2">
          <Link
            className="text-lg text-blue-500 hover:underline"
            to={IndexPageURL}
          >
            ← Mini Dice로 돌아가기
          </Link>
          <h1 className="text-4xl font-bold">설정</h1>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          <PushNotificationSettings />
        </div>
      </div>
    </ServiceLayout>
  );
}
