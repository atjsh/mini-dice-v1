import { Link } from "react-router-dom";
import { useUser, useQueryString } from "../libs";
import { googleOAuthCredential } from "./Login.page";
import { LogoutPageURL } from "./routes";

export function ProfilePage() {
  const { data: user, isLoading } = useUser();

  const emailAlreadyUsedFail =
    useQueryString().get("failReason") === "emailAlreadyUsed";

  const alreadyUsedEmailAddress = useQueryString().get("emailAddress");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ul>
        <li>유저명: {user?.username}</li>
        <li>가진 돈: {user?.cash}</li>
        <li>이메일: {user?.email}</li>
      </ul>

      <Link to={LogoutPageURL}>로그아웃</Link>

      <br />
      {isLoading == false && user?.email == null ? (
        <>
          <h1>구글 계정으로 로그인하여 가입을 완료하고 랭킹에 오르세요.</h1>
          <p>
            현재 임시 계정으로 게임하고 있습니다. 임시 계정은 로그아웃된 경우
            다시 로그인할 수 없게 되는 계정입니다. 임시 계정을 계속 유지시키려면
            구글 계정으로 로그인해 가입을 완료하세요.
          </p>
          {emailAlreadyUsedFail && (
            <div>
              <p>
                죄송합니다! '{alreadyUsedEmailAddress}' 이메일은 이미 가입된
                이메일입니다. 다른 이메일로 가입하세요.
              </p>
            </div>
          )}
          <a
            href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleOAuthCredential.clientId}&redirect_uri=${process.env.REACT_APP_TDOL_SERVER_URL}${googleOAuthCredential.redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email&access_type=offline&include_granted_scopes=true&state=state_parameter_passthrough_value`}
          >
            login
          </a>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
