import { useState } from 'react';
import { useUser } from '../../libs';
import { googleOAuthCredential } from '../../pages/Login.page';

export const ConnectWithOauthWidget: React.FC = () => {
  const { data: user } = useUser();

  const [isCollapsed, setIsCollapsed] = useState(false);

  return user && user.email == null ? (
    isCollapsed ? (
      <button
        className="text-blue-500 font-bold border-blue-500 border-2 rounded-md px-3 py-2 bg-white transition-colors hover:bg-blue-500 hover:text-white"
        onClick={() => setIsCollapsed(false)}
      >
        구글 계정과 연결하기
      </button>
    ) : (
      <div className="bg-white rounded-3xl flex flex-col gap-3 py-7">
        <div className="flex flex-col gap-2 px-8">
          <div className="font-bold">구글 계정과 연결하세요.</div>
          <div className="text-sm">
            "바로 플레이"로 게임하고 있습니다. 로그아웃된 경우 다시 로그인할 수
            없게 됩니다. 이 계정을 계속 유지시키려면 구글 계정과 이 계정을
            연결시키세요.
          </div>
        </div>
        <div className="flex flex-col px-3 gap-2 text-center">
          <a
            className="font-bold rounded-md py-2 transition-colors text-blue-500 border-2 border-blue-500 hover:bg-blue-500 hover:text-white"
            href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleOAuthCredential.clientId}&redirect_uri=${process.env.REACT_APP_TDOL_SERVER_URL}${googleOAuthCredential.redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email&access_type=offline&include_granted_scopes=true&state=state_parameter_passthrough_value`}
          >
            구글 계정과 연결하기
          </a>
          <button
            className="text-gray-600 border-2 border-gray-300 rounded-md px-3 py-1 transition-colors hover:bg-gray-400 hover:text-white hover:border-gray-400"
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
