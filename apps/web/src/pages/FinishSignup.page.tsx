import {
  CountryCode3Type,
  countryMetadataIsoList,
  CountryMetadataType,
} from '@packages/shared-types';
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { WordmarkComponent } from '../components/wordmark/wordmark.component';
import { ServiceLayout } from '../layouts/service.layout';
import { useCompleteSignup } from '../libs';
import {
  validateUsername,
  ValidationError,
} from '../libs/tdol-server/profile/validations';
import { usePasskeyRegister } from '../libs/tdol-server/passkey';
import {
  LogoutPageURL,
  PrivacyPolicyPageURL,
  ServicePageURL,
  TermsPageURL,
} from './routes';

function UserCompleteSignupForm() {
  const completeSignupMutattion = useCompleteSignup();
  const passkeyRegister = usePasskeyRegister();
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState(
    countryMetadataIsoList.find((country) => country.code3 === 'USA')?.code3,
  );
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPasskeySetup, setShowPasskeySetup] = useState(false);

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
            setShowPasskeySetup(true);
            setDisabled(false);
          },
          onError: () => {
            setError('오류가 발생했습니다. 다시 시도해 주세요.');
            setDisabled(false);
          },
        },
      );
    }
  };

  const handlePasskeySetup = async () => {
    setError('');
    setDisabled(true);
    try {
      const result = await passkeyRegister.mutateAsync();
      if (result.namingOutcome === 'rename-failed') {
        try {
          window.alert(
            '패스키는 추가되었지만 이름을 저장하지 못했습니다. 설정에서 다시 변경해 주세요.',
          );
        } catch {
          // The passkey is valid even when the browser cannot show this notice.
        }
      }
      setSuccess(true);
    } catch (error: any) {
      setError(
        '패스키 등록에 실패했습니다. 나중에 설정에서 다시 추가할 수 있습니다.',
      );
      setDisabled(false);
      console.error('Passkey registration failed:', error);
    }
  };

  if (success) {
    return <Navigate to={ServicePageURL} replace />;
  }

  if (showPasskeySetup) {
    return (
      <div className="flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-4 max-w-xl w-full text-center">
          <h2 className="font-bold text-2xl">패스키 등록</h2>
          <p className="text-base">
            안전한 로그인을 위해 패스키를 등록해주세요.
            <br />
            패스키는 비밀번호 없이 지문, 얼굴 인식 또는 PIN으로 로그인할 수 있는
            안전한 방법입니다.
            <br />
            지금 건너뛰어도 설정에서 언제든 추가할 수 있습니다.
          </p>
        </div>

        {error && <div className="text-red-500 italic">{error}</div>}

        <button
          onClick={handlePasskeySetup}
          disabled={disabled}
          className={
            'inline-block px-5 py-5 max-w-xs w-full rounded-2xl transition duration-150 text-2xl font-semibold select-none transform active:scale-95 ' +
            (disabled
              ? 'text-white bg-gray-600 cursor-progress'
              : 'text-white bg-blue-500 dark:bg-blue-600 hover:bg-blue-400 active:bg-blue-700')
          }
        >
          {disabled ? '등록 중...' : '패스키 등록하기'}
        </button>

        <div className="text-sm text-gray-400">
          패스키를 등록하면 다음부터 빠르고 안전하게 로그인할 수 있습니다.
        </div>
        <button
          onClick={() => setSuccess(true)}
          disabled={disabled}
          className="inline-block text-blue-600 hover:underline p-3"
        >
          나중에 하기
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-10">
      <div className="flex flex-col items-center gap-2 max-w-xl w-full">
        <label className=" font-medium text-xl" htmlFor="username">
          닉네임을 입력하세요.
        </label>
        <input
          id="username"
          autoFocus={true}
          type="text"
          className="border-2 border-black rounded-xl p-2 w-10/12 dark:text-black bg-white dark:bg-white"
          placeholder="2자 이상, 20자 미만"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value.trim())
          }
        />
      </div>
      <div className="flex flex-col items-center gap-2 hidden">
        <div className=" font-medium text-lg text-center">
          당신이 거주중인 국가를 선택하세요.
        </div>
        <div className=" font-normal text-sm text-center">
          서비스 언어는 "<span className=" font-bold">한국어</span>"로 기본
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
      <div className=" italic text-red-500">{error}</div>

      <button
        type="submit"
        disabled={disabled}
        className={
          'inline-block px-5 py-5 max-w-xs w-full rounded-2xl transition duration-150 text-2xl font-semibold select-none transform active:scale-95 ' +
          (disabled
            ? 'text-white bg-gray-600 cursor-progress'
            : 'text-white bg-blue-500 dark:bg-blue-600 hover:bg-blue-400 active:bg-blue-700 transform active:scale-95')
        }
      >
        다음
      </button>
      <div className=" text-sm text-gray-400">
        위 '다음' 버튼을 누르는 것은{' '}
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
      <Link to={LogoutPageURL} className="font-medium">
        취소
      </Link>
    </form>
  );
}

export function LoginSuccessPage() {
  return (
    <ServiceLayout>
      <div className=" flex flex-col gap-10">
        <div className="text-center">
          <div className="flex-col flex gap-2">
            <h1 className="text-4xl md:text-6xl font-extrabold">
              <WordmarkComponent />
            </h1>
            <div className="font-medium text-xl">회원가입 완료하기</div>
          </div>
        </div>
        <UserCompleteSignupForm />
      </div>
    </ServiceLayout>
  );
}
