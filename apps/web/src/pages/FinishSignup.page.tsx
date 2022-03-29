import {
  CountryCode3Type,
  countryMetadataIsoList,
  CountryMetadataType,
} from '@packages/shared-types';
import { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { ServiceLayout } from '../layouts/wide-service/service.layout';
import {
  revokeUserAccessToken,
  useCompleteSignup,
  useQueryString,
  userCompleteSignup,
} from '../libs';
import {
  validateUsername,
  ValidationError,
} from '../libs/tdol-server/profile/validations';
import { FinishSignupPageURL, LogoutPageURL, ServicePageURL } from './routes';

function UserCompleteSignupForm() {
  const completeSignupMutattion = useCompleteSignup();
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState(
    countryMetadataIsoList.find((country) => country.code3 === 'USA')?.code3,
  );
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const usernameValidationResult = validateUsername(username);

    if (usernameValidationResult == ValidationError.TOOSHORT) {
      setError(
        `닉네임 '${username}'은 너무 짧습니다. 2자~20자 길이의 닉네임을 정하세요.`,
      );
    } else if (usernameValidationResult == ValidationError.TOOLONG) {
      setError(
        `닉네임 '${username}'은 너무 깁니다. 2자~20자 길이의 닉네임을 정하세요.`,
      );
    } else {
      setDisabled(true);
      completeSignupMutattion.mutate(
        { username, countryCode3: country },
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

  return success ? (
    <Redirect to={ServicePageURL} push={false} />
  ) : (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-10">
      <div className="flex flex-col items-center gap-2">
        <div className=" font-medium text-xl">닉네임을 입력하세요.</div>
        <input
          type="text"
          className="border-2 border-black rounded-xl p-2 w-96"
          placeholder="2자 이상, 20자 미만"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value.trim())
          }
        />
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className=" font-medium text-xl">
          당신이 거주 중인 국가를 선택하세요.
        </div>
        <select
          name="country"
          value={country}
          className="border-2 border-black rounded-xl p-2 w-96"
          onChange={(e) => setCountry(e.target.value as CountryCode3Type)}
        >
          {countryMetadataIsoList.map((country: CountryMetadataType) => (
            <option key={country.code3} value={country.code3}>
              {country.name}
            </option>
          ))}
        </select>
      </div>
      <div className=" italic text-red-500">{error}</div>

      <button
        type="submit"
        disabled={disabled}
        className={
          'inline-block px-5 py-7 rounded-2xl transition duration-150 text-2xl font-semibold select-none transform active:scale-95 ' +
          (disabled
            ? 'text-white bg-gray-600 cursor-progress'
            : 'text-white bg-blue-500 hover:bg-blue-400 active:bg-blue-700 transform active:scale-95')
        }
      >
        회원가입하고 플레이
      </button>
      <Link to={LogoutPageURL} className="font-medium">
        취소
      </Link>
    </form>
  );
}

export function LoginSuccessPage() {
  useEffect(() => {
    revokeUserAccessToken();
  }, []);

  return (
    <ServiceLayout>
      <div className="text-center">
        <div className="flex-col flex gap-2">
          <h1 className="text-5xl font-bold">Mini Dice</h1>
          <div className="font-medium text-xl">회원가입 완료하기</div>
        </div>
      </div>
      <UserCompleteSignupForm />
    </ServiceLayout>
  );
}
