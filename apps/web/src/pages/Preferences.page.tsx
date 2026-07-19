import { Link } from 'react-router-dom';
import {
  SettingsList,
  SettingsNavigationLabel,
  SettingsNavigationLink,
} from '../components/settings';
import { ServiceLayout } from '../layouts/service.layout';
import { useUser } from '../libs';
import {
  IndexPageURL,
  ProfilePreferencePageURL,
  ServicePreferencePageURL,
  WebNotificationPreferencePageURL,
} from './routes';

export function PreferencesPage() {
  const { data: user } = useUser();

  return (
    <ServiceLayout>
      <div className="self-center max-w-2xl m-auto">
        <div className="flex flex-col gap-2 mb-6">
          <Link
            className="text-lg text-blue-500 hover:underline"
            to={IndexPageURL}
          >
            ← Mini Dice로 돌아가기
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            설정
          </h1>
        </div>

        <nav aria-label="설정 항목" className="flex flex-col gap-4">
          <SettingsList>
            <SettingsNavigationLink to={ProfilePreferencePageURL}>
              <SettingsNavigationLabel
                title={user?.username ?? '프로필'}
                subtitle="내 프로필"
              />
            </SettingsNavigationLink>
          </SettingsList>
          <SettingsList>
            <SettingsNavigationLink to={ServicePreferencePageURL}>
              일반
            </SettingsNavigationLink>
            <SettingsNavigationLink to={WebNotificationPreferencePageURL}>
              푸시 알림
            </SettingsNavigationLink>
          </SettingsList>
        </nav>
      </div>
    </ServiceLayout>
  );
}
