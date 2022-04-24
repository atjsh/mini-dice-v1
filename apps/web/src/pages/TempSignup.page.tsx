import HCaptcha from '@hcaptcha/react-hcaptcha';
import {
  CountryCode3Type,
  countryMetadataIsoList,
  CountryMetadataType,
} from '@packages/shared-types';
import { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { WordmarkComponent } from '../components/wordmark/wordmark.component';
import { getGoogleOAuthPageUrl } from '../google-oauth';
import { ServiceLayout } from '../layouts/service.layout';
import {
  validateUsername,
  ValidationError,
} from '../libs/tdol-server/profile/validations';
import { useTempSignup } from '../libs/tdol-server/temp-signup';
import {
  IndexPageURL,
  PrivacyPolicyPageURL,
  ServicePageURL,
  TermsPageURL,
} from './routes';

function TempSignupForm() {
  const [username, setUsername] = useState('');
  const [hCaptchaToken, setHCaptchaToken] = useState<false | string>(false);
  const [country, setCountry] = useState(
    countryMetadataIsoList.find((country) => country.code3 === 'USA')?.code3,
  );
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [success, setSuccess] = useState(false);

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
    } else if (country == undefined) {
      setError(`당신이 거주 중인 국가를 선택해 주세요.`);
    } else {
      setDisabled(true);
      mutation.mutate(
        {
          hCaptchaSuccessToken: hCaptchaToken,
          username,
          countryCode3: country,
        },
        {
          onSuccess: () => {
            setSuccess(true);
          },
          onError: () => {
            setError('오류가 발생했습니다. 다시 시도해 주세요.');
            setDisabled(false);
          },
        },
      );
    }
  };

  const mutation = useTempSignup();

  return success ? (
    <Redirect to={ServicePageURL} push={false} />
  ) : (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-col items-center gap-2 max-w-xl w-full">
        <div className=" font-medium text-xl">닉네임을 입력하세요.</div>
        <input
          type="text"
          className="border-2 border-black rounded-xl p-2 w-10/12 dark:text-black"
          placeholder="2자 이상, 20자 미만"
          value={username}
          onChange={handleChange}
        />
      </div>
      <div className=" flex-col items-center gap-2 hidden">
        <div className=" font-medium text-lg text-center">
          당신이 거주중인 국가를 선택하세요.
        </div>
        <div className=" font-normal text-sm text-center">
          서비스는 "<span className=" font-bold">한국어</span>"로 기본
          제공됩니다
        </div>
        <select
          name="country"
          value={country}
          className="border-2 border-black text-sm rounded-xl p-2 w-72"
          onChange={(e) => setCountry(e.target.value as CountryCode3Type)}
        >
          {countryMetadataIsoList.map((country: CountryMetadataType) => (
            <option key={country.code3} value={country.code3}>
              {country.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1 text-center">
        <HCaptcha
          sitekey={`${process.env.HCAPTCHA_SITE_KEY}`}
          onVerify={(token) => setHCaptchaToken(token)}
        />
      </div>
      <a
        className=" text-base text-blue-600 hover:underline p-5 text-center hidden"
        href={getGoogleOAuthPageUrl()}
      >
        <span className=" text-black dark:text-white">
          캡차 검사가 싫으신가요?
        </span>{' '}
        <br />
        캡차 검사 없이 <span className="font-bold">구글 계정</span>으로 시작할
        수도 있습니다. →
      </a>
      <div className=" italic text-red-500">{error}</div>

      <button
        onClick={handleSubmit}
        disabled={disabled}
        className={
          'inline-block px-5 py-5 max-w-xs w-full rounded-2xl transition duration-150 text-2xl font-semibold select-none transform active:scale-95 ' +
          (disabled
            ? 'text-white bg-gray-600 cursor-progress'
            : 'text-white bg-blue-500 dark:bg-blue-600 hover:bg-blue-400 active:bg-blue-700 transform active:scale-95')
        }
      >
        시작
      </button>
      <div className=" text-sm text-gray-400">
        위 '시작' 버튼을 누르는 것은{' '}
        <Link
          to={PrivacyPolicyPageURL}
          className="hover:underline text-gray-600"
        >
          개인정보 처리방침
        </Link>
        과{' '}
        <Link to={TermsPageURL} className="hover:underline text-gray-600">
          이용약관
        </Link>
        에 동의하는 것으로 간주됩니다.
      </div>
      <Link to={IndexPageURL} className="font-medium hover:underline p-1">
        취소
      </Link>
    </div>
  );
}

export const TempSignupPage: React.FC = () => {
  return (
    <ServiceLayout>
      <div className=" flex flex-col gap-10">
        <div className="text-center">
          <div className="flex-col flex gap-2">
            <h1 className="text-5xl font-bold">
              <WordmarkComponent />
            </h1>
            <div className="font-medium text-xl">바로 시작 계정 생성</div>
          </div>
        </div>
        <TempSignupForm />
      </div>
    </ServiceLayout>
  );
};
