import { Link } from 'react-router-dom';
import {
  SettingsList,
  SettingsNavigationLabel,
  SettingsNavigationLink,
} from '../components/settings';
import { ServiceLayout } from '../layouts/service.layout';
import { useUser } from '../libs';
import { usePasskeyList } from '../libs/tdol-server/passkey';
import {
  AuthenticationPreferencePageURL,
  IndexPageURL,
  LogoutPageURL,
  ServicePreferencePageURL,
  TerminatePageURL,
  UsernamePreferencePageURL,
  WebNotificationPreferencePageURL,
} from './routes';

export function PreferencesPage() {
  const { data: user } = useUser();
  const { data: passkeys, isLoading: arePasskeysLoading } = usePasskeyList();

  if (!user) {
    return null;
  }

  const authenticationSummary =
    arePasskeysLoading || passkeys === undefined
      ? undefined
      : [
          user.email != null && '구글 계정 등록됨',
          passkeys.length > 0 && `패스키 ${passkeys.length}개 등록됨`,
        ]
          .filter(Boolean)
          .join(' · ');
  const authenticationSubtitle =
    authenticationSummary === undefined ? undefined : authenticationSummary ? (
      authenticationSummary
    ) : (
      <span className="text-orange-700 dark:text-orange-400">
        로그인 수단 추가
      </span>
    );

  const registrationDate = new Date(user.createdAt);
  const registrationDateTime = Number.isNaN(registrationDate.getTime())
    ? undefined
    : registrationDate.toISOString();

  return (
    <ServiceLayout>
      <div className="self-center m-auto w-full max-w-2xl">
        <div className="mb-8 flex flex-col gap-2">
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

        <section aria-labelledby="profile-settings-heading">
          <div className="flex flex-col gap-4">
            <dl className="divide-y divide-gray-200 overflow-hidden rounded-xl bg-gray-50 shadow-xs dark:divide-zinc-700 dark:bg-zinc-900">
              <div className="flex min-h-[52px] flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <dt className="shrink-0 font-medium text-gray-900 dark:text-gray-100">
                  닉네임
                </dt>
                <dd className="min-w-0 select-all break-all text-sm text-gray-600 dark:text-gray-400 sm:text-right">
                  {user.username}
                </dd>
              </div>
              <div className="flex min-h-[52px] flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <dt className="shrink-0 font-medium text-gray-900 dark:text-gray-100">
                  사용자 ID
                </dt>
                <dd className="min-w-0 select-all break-all text-sm text-gray-600 dark:text-gray-400 sm:text-right">
                  <code>{user.id}</code>
                </dd>
              </div>
              <div className="flex min-h-[52px] flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <dt className="shrink-0 font-medium text-gray-900 dark:text-gray-100">
                  가입일
                </dt>
                <dd className="text-gray-600 dark:text-gray-400 sm:text-right">
                  <time dateTime={registrationDateTime}>
                    {registrationDateTime
                      ? registrationDate.toLocaleDateString('ko-kr')
                      : '알 수 없음'}
                  </time>
                </dd>
              </div>
            </dl>

            <nav aria-label="프로필 설정" className="flex flex-col gap-4">
              <SettingsList>
                <SettingsNavigationLink to={UsernamePreferencePageURL}>
                  닉네임 변경
                </SettingsNavigationLink>
                <SettingsNavigationLink to={AuthenticationPreferencePageURL}>
                  <SettingsNavigationLabel
                    title="로그인 및 보안"
                    subtitle={authenticationSubtitle}
                  />
                </SettingsNavigationLink>
              </SettingsList>
              <SettingsList>
                <SettingsNavigationLink to={TerminatePageURL}>
                  회원 탈퇴
                </SettingsNavigationLink>
              </SettingsList>
            </nav>
          </div>
        </section>

        <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-zinc-800" />

        <section aria-labelledby="app-settings-heading">
          <nav aria-label="앱 설정" className="flex flex-col gap-4">
            <SettingsList>
              <SettingsNavigationLink to={ServicePreferencePageURL}>
                일반
              </SettingsNavigationLink>
              <SettingsNavigationLink to={WebNotificationPreferencePageURL}>
                푸시 알림
              </SettingsNavigationLink>
            </SettingsList>
            <SettingsList>
              <SettingsNavigationLink to={LogoutPageURL}>
                로그아웃
              </SettingsNavigationLink>
            </SettingsList>
          </nav>
        </section>
      </div>
    </ServiceLayout>
  );
}
