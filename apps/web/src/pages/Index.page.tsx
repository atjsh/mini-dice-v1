import { Link } from 'react-router-dom';
import { HealthCheckComponent } from '../components/health-check/health-check.component';
import {
  KoreanWordmarkComponent,
  WordmarkComponent,
} from '../components/wordmark/wordmark.component';
import { getGoogleOAuthPageUrl } from '../google-oauth';
import { ServiceLayout } from '../layouts/service.layout';
import { useQueryString } from '../libs';
import { TempSignupPageURL } from './routes';

export function IndexPage() {
  const loginRequired = useQueryString().get('loginRequired') === 'true';

  return (
    <ServiceLayout hideFooter={false}>
      <div className=" flex flex-col gap-10">
        <div className="text-center">
          <div className="text-4xl mb-6 tracking-widest">🎲🗺💵</div>
          <div className="flex-col flex gap-1">
            <h1 className="text-4xl font-bold">
              <KoreanWordmarkComponent />
            </h1>
            <h2 className="text-2xl font-bold">
              <WordmarkComponent />
            </h2>
            <HealthCheckComponent />

            <h2 className=" self-center mt-5 text-xl">
              {loginRequired ? (
                '계속하려면 로그인하세요.'
              ) : (
                <>
                  주사위를 굴리며 맵을 모험하고 <br /> 코인을 벌어 랭킹에
                  오르세요.
                </>
              )}
            </h2>
          </div>
        </div>
        <div className=" flex flex-col text-center gap-5">
          <div>
            <Link
              className="inline-block text-white px-5 py-5 max-w-xs w-full rounded-2xl transition duration-150 text-2xl font-semibold bg-blue-500 dark:bg-blue-600 hover:bg-blue-400 active:bg-blue-700 select-none transform active:scale-95"
              to={TempSignupPageURL}
            >
              {loginRequired ? '바로 시작 계정 생성' : '바로 시작'}
            </Link>
          </div>
          <div>
            <a
              className="inline-block text-xl text-blue-600 hover:underline p-5"
              href={getGoogleOAuthPageUrl()}
            >
              {loginRequired
                ? '구글 계정으로 로그인 →'
                : '구글 계정으로 시작 →'}
            </a>
          </div>
        </div>
      </div>
    </ServiceLayout>
  );
}
