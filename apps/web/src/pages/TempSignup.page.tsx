import { ServiceLayout } from '../layouts/wide-service/service.layout';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useState } from 'react';
import {
  validateUsername,
  ValidationError,
} from '../libs/tdol-server/profile/validations';
import { useTempSignup } from '../libs/tdol-server/temp-signup';
import { RedirectToServiceIfLoggedIn } from '../components/redirect/redirect-to-service-if-loggined.component';
import { Link } from 'react-router-dom';
import { IndexPageURL, ServicePageURL } from './routes';

function TempSignupForm() {
  const [username, setUsername] = useState('');
  const [hCaptchaToken, setHCaptchaToken] = useState<false | string>(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value.trim());

  const handleSubmit = async () => {
    const usernameValidationResult = validateUsername(username);

    if (hCaptchaToken == false) {
      setError("'사람입니다' 테스트를 먼저 완료해 주세요.");
    } else if (usernameValidationResult == ValidationError.TOOSHORT) {
      setError(
        `닉네임 '${username}'은 너무 짧습니다. 2자~20자 길이의 닉네임을 정하세요.`,
      );
    } else if (usernameValidationResult == ValidationError.TOOLONG) {
      setError(
        `닉네임 '${username}'은 너무 깁니다. 2자~20자 길이의 닉네임을 정하세요.`,
      );
    } else {
      mutation.mutate(
        {
          hCaptchaSuccessToken: hCaptchaToken,
          username,
        },
        {
          onSuccess: () => {
            window.location.href =
              '/login-success?signinFinished=true&isNewUser=true';
          },
        },
      );
    }
  };

  const mutation = useTempSignup();

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-col items-center gap-2">
        <div className=" font-medium text-xl">닉네임을 입력하세요.</div>
        <input
          type="text"
          className="border-2 border-black rounded-xl p-2 w-96"
          placeholder="2자 이상, 20자 미만"
          value={username}
          onChange={handleChange}
        />
        <div className=" italic text-red-500">{error}</div>
      </div>
      <div className="">
        <HCaptcha
          sitekey={`${process.env.REACT_APP_HCAPTCHA_SITE_KEY}`}
          onVerify={(token) => setHCaptchaToken(token)}
        />
      </div>

      <button
        onClick={handleSubmit}
        className="inline-block text-white px-5 py-7 rounded-2xl transition duration-150 text-2xl font-semibold bg-blue-500 hover:bg-blue-400 active:bg-blue-700 select-none transform active:scale-95"
      >
        플레이
      </button>
      <Link to={IndexPageURL} className="font-medium hover:underline p-1">
        취소
      </Link>
    </div>
  );
}

export const TempSignupPage: React.FC = () => {
  return (
    <RedirectToServiceIfLoggedIn>
      <ServiceLayout>
        <div className="text-center">
          <div className="flex-col flex gap-2">
            <h1 className="text-5xl font-bold">Mini Dice</h1>
            <div className="font-medium text-xl">바로 플레이 계정 생성</div>
          </div>
        </div>
        <TempSignupForm />
      </ServiceLayout>
    </RedirectToServiceIfLoggedIn>
  );
};
