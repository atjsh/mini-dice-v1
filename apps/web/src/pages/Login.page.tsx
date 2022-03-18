import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useState } from "react";
import { Redirect } from "react-router";
import { useUser } from "../libs/tdol-server/profile/use-user.hook";
import {
  validateUsername,
  ValidationError
} from "../libs/tdol-server/profile/validations";
import { useTempSignup } from "../libs/tdol-server/temp-signup";

export const googleOAuthCredential = {
  clientId:
    "445176763040-5ovst5gjp3kco6g39kifnbpgvl5j7nrj.apps.googleusercontent.com",
  redirectUri: "/auth/google-oauth"
};

function RedirectToProfileIfLoggedIn() {
  const { data } = useUser();

  if (data) {
    return <Redirect to="/profile"></Redirect>;
  }

  return <></>;
}

function LoginForm() {
  return (
    <>
      <h1>구글 계정으로 로그인 및 가입하기</h1>
      <a
        href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleOAuthCredential.clientId}&redirect_uri=${process.env.REACT_APP_TDOL_SERVER_URL}${googleOAuthCredential.redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email&access_type=offline&include_granted_scopes=true&state=state_parameter_passthrough_value`}
      >
        login
      </a>
    </>
  );
}

function TempSignupForm() {
  const [username, setUsername] = useState("");
  const [hCaptchaToken, setHCaptchaToken] = useState<false | string>(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value.trim());

  const handleSubmit = async () => {
    const usernameValidationResult = validateUsername(username);

    if (hCaptchaToken == false) {
      setError("'사람입니다'를 완료해 주세요.");
    } else if (usernameValidationResult == ValidationError.TOOSHORT) {
      setError(
        `'${username}'은 너무 짧습니다. 2자~20자 길이의 닉네임을 정하세요.`
      );
    } else if (usernameValidationResult == ValidationError.TOOLONG) {
      setError(
        `'${username}'은 너무 깁니다. 2자~20자 길이의 닉네임을 정하세요.`
      );
    } else {
      mutation.mutate(
        {
          hCaptchaSuccessToken: hCaptchaToken,
          username
        },
        {
          onSuccess: () => {
            window.location.href =
              "/login-success?signinFinished=true&isNewUser=true";
          }
        }
      );
    }
  };

  const mutation = useTempSignup();

  return (
    <div>
      <br />
      <h1>구글 계정 연동 없이 임시 가입하기</h1>
      <p>
        구글 계정으로 로그인하지 않고 게임을 즐깁니다. 계정 정보가 브라우저에만
        한시적으로 저장됩니다.
      </p>

      <HCaptcha
        sitekey={`${process.env.REACT_APP_HCAPTCHA_SITE_KEY}`}
        onVerify={(token) => setHCaptchaToken(token)}
      />

      <input
        type="text"
        name=""
        id=""
        placeholder="username"
        value={username}
        onChange={handleChange}
      />

      <button onClick={handleSubmit}>임시 가입</button>
      {error}
    </div>
  );
}

export function LoginPage() {
  return (
    <>
      <RedirectToProfileIfLoggedIn />

      <br />
      <LoginForm />
      <TempSignupForm />
    </>
  );
}
