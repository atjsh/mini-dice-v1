import { Link } from 'react-router-dom';
import { WordmarkComponent } from '../components/wordmark/wordmark.component';
import { getGoogleOAuthPageUrl } from '../google-oauth';
import { ServiceLayout } from '../layouts/service.layout';
import { useQueryString } from '../libs';
import { TempSignupPageURL, UpdatesPageURL } from './routes';
import { NewestEntrySummary } from './Updates.page';

export function IndexPage() {
  const loginRequired = useQueryString().get('loginRequired') === 'true';

  return (
    <ServiceLayout hideFooter={false}>
      <div className=" flex flex-col gap-10">
        <div className="text-center">
          <div className="flex-col flex gap-1">
            <h1 className="text-4xl md:text-6xl font-extrabold">
              <WordmarkComponent />
            </h1>

            <h2 className=" self-center mt-5 text-base md:text-xl">
              {loginRequired ? (
                '계속하려면 로그인하세요.'
              ) : (
                <>
                  주사위를 굴리며 맵을 모험하고 <br /> 코인을 벌어 순위에
                  오르세요.
                </>
              )}
            </h2>
          </div>
        </div>
        <div className=" text-center">
          <Link
            to={UpdatesPageURL}
            className=" hover:underline py-2 px-5 md:py-3 md:px-7 text-base md:text-lg border border-zinc-500 rounded-full inline-block w-fit "
          >
            <div className=" text-xs">새로운 소식</div>
            <NewestEntrySummary />
          </Link>
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
