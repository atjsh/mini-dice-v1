import { Link } from 'react-router-dom';
import { ServiceLayout } from '../layouts/service.layout';
import { PasskeyManagementSection } from '../components/passkey/PasskeyManagementSection';
import { ServicePageURL } from './routes';

export function PreferencesPage() {
  return (
    <ServiceLayout>
      <div className="self-center max-w-2xl m-auto">
        <div className="flex flex-col gap-2 mb-6">
          <Link
            className="text-lg text-blue-500 hover:underline"
            to={ServicePageURL}
          >
            ← 게임으로 돌아가기
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            설정
          </h1>
        </div>

        <div className="flex flex-col gap-8">
          <PasskeyManagementSection />

          {/* Future sections will be added here by #70 and #71 */}
        </div>
      </div>
    </ServiceLayout>
  );
}
