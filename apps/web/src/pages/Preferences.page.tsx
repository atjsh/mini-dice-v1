import { Link } from 'react-router-dom';
import { ServiceLayout } from '../layouts/service.layout';
import { PasskeyManagementSection } from '../components/passkey/PasskeyManagementSection';
import { PushNotificationSettings } from '../components/push-notification';
import {
  useUpdateUserPreference,
  useUserPreference,
} from '../libs/tdol-server/user-preference';
import { IndexPageURL } from './routes';

function CommentPreferenceSection() {
  const { data: preference, isLoading } = useUserPreference();
  const updatePreference = useUpdateUserPreference();

  const commentsVisible = !(preference?.alwaysHideComments ?? false);

  return (
    <section className="border border-gray-300 dark:border-gray-600 rounded-xl p-6 bg-white dark:bg-zinc-800">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            댓글 표시
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            게임 화면에서 칸 댓글과 댓글 작성 버튼을 표시합니다.
          </p>
        </div>
        <button
          onClick={() =>
            updatePreference.mutate({
              alwaysHideComments: commentsVisible,
            })
          }
          disabled={isLoading || updatePreference.isLoading}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            commentsVisible ? 'bg-blue-600' : 'bg-gray-200'
          } ${
            isLoading || updatePreference.isLoading
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer'
          }`}
          aria-label="댓글 표시 토글"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              commentsVisible ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      {updatePreference.isError && (
        <p className="text-sm text-red-600 mt-2" role="alert">
          설정을 저장하지 못했습니다. 다시 시도해 주세요.
        </p>
      )}
    </section>
  );
}

export function PreferencesPage() {
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

        <div className="flex flex-col gap-8">
          <PasskeyManagementSection />
          <PushNotificationSettings />
          <CommentPreferenceSection />
        </div>
      </div>
    </ServiceLayout>
  );
}
