import { useState } from 'react';
import { googleOAuthCredential } from '../../constants';
import { useUser } from '../../libs';

export const ConnectWithOauthWidget: React.FC = () => {
  const { data: user } = useUser();

  const [isCollapsed, setIsCollapsed] = useState(false);

  return user && user.email == null ? (
    isCollapsed ? (
      <button
        className="bg-white dark:md:bg-zinc-800 dark:bg-black rounded-3xl flex flex-col gap-3 py-4 px-8 hover:bg-gray-200 active:bg-gray-300 transition-colors border border-white hover:border-gray-400 font-bold dark:hover:bg-zinc-700 dark:active:bg-zinc-600 dark:border-black dark:hover:border-zinc-500"
        onClick={() => setIsCollapsed(false)}
      >
        구글 계정과 연결하기 →
      </button>
    ) : (
      <div className="bg-white dark:md:bg-zinc-800 dark:bg-black rounded-3xl flex flex-col gap-3 py-7">
        <div className="flex flex-col gap-2 px-8">
          <div className="font-bold">다시 로그인할 수 있도록 계정 유지하기</div>
          <div className="text-sm">
            "바로 플레이"로 게임하고 있습니다.{' '}
            <span className=" font-bold">
              로그아웃된 경우 다시 로그인할 수 없게 됩니다.
            </span>{' '}
            <br />이 계정을 계속 유지시키려면 구글 계정과 이 계정을
            연결시키세요.
          </div>
        </div>
        <div className="flex flex-col px-3 gap-2 text-center">
          <a
            className="font-bold rounded-md py-2 transition-colors text-blue-500 dark:text-blue-600 border-2 border-blue-500 hover:bg-blue-500 dark:hover:bg-blue-600 dark:border-blue-600 hover:text-white active:bg-blue-700 "
            href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${
              googleOAuthCredential.clientId
            }&redirect_uri=${process.env.REACT_APP_TDOL_SERVER_URL}${
              googleOAuthCredential.redirectUri
            }/${btoa(
              process.env.REACT_APP_MINIDICE_WEB_URL!,
            )}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email&access_type=offline&include_granted_scopes=true&state=state_parameter_passthrough_value`}
          >
            구글 계정과 연결하기
          </a>
          <button
            className="text-gray-600 dark:text-zinc-400 border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-200 active:bg-gray-300 transition-colors hover:border-gray-400 dark:hover:bg-zinc-700 dark:active:bg-zinc-600 dark:border-zinc-400 dark:hover:border-zinc-500"
            onClick={() => setIsCollapsed(true)}
          >
            나중에 하기
          </button>
        </div>
      </div>
    )
  ) : (
    <></>
  );
};
