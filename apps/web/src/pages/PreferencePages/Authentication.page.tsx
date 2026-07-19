import { Link } from 'react-router-dom';
import { PasskeyManagementSection } from '../../components/passkey/PasskeyManagementSection';
import {
  SettingsActionLink,
  SettingsCard,
  SettingsHeader,
} from '../../components/settings';
import { getGoogleOAuthPageUrl } from '../../google-oauth';
import { ServiceLayout } from '../../layouts/service.layout';
import { useUser } from '../../libs';
import { ProfilePreferencePageURL } from '../routes';

export function AuthenticationPreferencePage() {
  const { data: user } = useUser();

  return (
    <ServiceLayout>
      <div className="self-center max-w-2xl m-auto">
        <div className="flex flex-col gap-2 mb-6">
          <Link
            className="break-all text-lg text-blue-500 hover:underline"
            to={ProfilePreferencePageURL}
          >
            ← {user ? `프로필: ${user.username}` : '프로필'}
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            로그인 및 보안
          </h1>
        </div>

        <div className="flex flex-col gap-8">
          {user && user.email == null && (
            <SettingsCard>
              <SettingsHeader
                title="Google 계정 연결"
                description="진행 상황을 Google 계정에 연결합니다."
                className="mb-4"
              />
              <SettingsActionLink href={getGoogleOAuthPageUrl()}>
                구글 계정과 연결하기
              </SettingsActionLink>
            </SettingsCard>
          )}
          <PasskeyManagementSection />
        </div>
      </div>
    </ServiceLayout>
  );
}
