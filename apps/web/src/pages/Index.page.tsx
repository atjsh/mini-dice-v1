import { Link, Redirect } from 'react-router-dom';
import { googleOAuthCredential } from '../constants';
import { ServiceLayout } from '../layouts/wide-service/service.layout';
import { useUser } from '../libs';
import { ServicePageURL, TempSignupPageURL } from './routes';

const linkBoxCommonStyle =
  'rounded-xl w-96 max-w-full h-60 relative font-bold transition-colors mr-2';

export function IndexPage() {
  const { data, isLoading } = useUser();

  return isLoading == true ? (
    <></>
  ) : data != null ? (
    <Redirect to={ServicePageURL} />
  ) : (
    <ServiceLayout>
      <div className="text-center">
        <div className="text-4xl mb-6 tracking-widest">🎲🗺💵</div>
        <div className="flex-col flex gap-2">
          <h1 className="text-5xl font-bold">Mini Dice</h1>
          <div className="font-medium text-xl">인생게임</div>
        </div>
      </div>
      <div className=" flex flex-col text-center gap-5">
        <div>
          <Link
            className="inline-block text-white px-5 py-7 rounded-2xl transition duration-150 text-2xl font-semibold bg-blue-500 hover:bg-blue-400 active:bg-blue-700 select-none transform active:scale-95"
            to={TempSignupPageURL}
          >
            바로 플레이
          </Link>
        </div>
        <div>
          <a
            className="inline-block text-xl text-blue-600 hover:underline p-5"
            href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleOAuthCredential.clientId}&redirect_uri=${process.env.REACT_APP_TDOL_SERVER_URL}${googleOAuthCredential.redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email&access_type=offline&include_granted_scopes=true&state=state_parameter_passthrough_value`}
          >
            구글 계정으로 플레이 →
          </a>
        </div>
      </div>
    </ServiceLayout>
  );
}
