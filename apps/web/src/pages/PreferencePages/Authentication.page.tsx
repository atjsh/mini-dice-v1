import { Link } from 'react-router-dom';
import { AuthenticationMethodsSection } from '../../components/authentication/AuthenticationMethodsSection';
import { ServiceLayout } from '../../layouts/service.layout';
import { useUser } from '../../libs';
import { PreferencesPageURL } from '../routes';

export function AuthenticationPreferencePage() {
  const { data: user } = useUser();

  return (
    <ServiceLayout>
      <div className="self-center m-auto w-full max-w-2xl">
        <div className="mb-8 flex flex-col gap-2">
          <Link
            className="break-all text-lg text-blue-500 hover:underline"
            to={PreferencesPageURL}
          >
            ← 설정
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            로그인 및 보안
          </h1>
        </div>

        {user && (
          <AuthenticationMethodsSection
            user={{
              authProvider: user.authProvider,
              email: user.email ?? null,
            }}
          />
        )}
      </div>
    </ServiceLayout>
  );
}
