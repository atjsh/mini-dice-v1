import { Link } from 'react-router-dom';
import { ServiceLayout } from '../../layouts/service.layout';
import { PreferencesPageURL } from '../routes';
import {
  SettingsCard,
  SettingsHeader,
  SettingsToggle,
  SettingsNotice,
} from '../../components/settings';
import { useUserPreference, useUpdateUserPreference } from '../../libs';

export function ServicePreferencePage() {
  const { data: preference, isLoading } = useUserPreference();
  const updatePreference = useUpdateUserPreference();

  const commentsVisible = !(preference?.alwaysHideComments ?? false);

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
            일반
          </h1>
        </div>

        <SettingsCard>
          <div className="flex items-center justify-between gap-5">
            <SettingsHeader
              title="댓글 표시"
              description="칸 댓글과 댓글 작성 버튼을 표시합니다."
              className="flex-1"
            />
            <SettingsToggle
              onChange={() =>
                updatePreference.mutate({
                  alwaysHideComments: commentsVisible,
                })
              }
              disabled={isLoading || updatePreference.isPending}
              checked={commentsVisible}
              ariaLabel="댓글 표시 토글"
            />
          </div>
          {updatePreference.isError && (
            <SettingsNotice tone="error" className="mt-4" role="alert">
              설정을 저장하지 못했습니다. 다시 시도해 주세요.
            </SettingsNotice>
          )}
        </SettingsCard>
      </div>
    </ServiceLayout>
  );
}
