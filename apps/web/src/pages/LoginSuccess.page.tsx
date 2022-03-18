import { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import {
  SupportedCountryEnum,
  updateUserProfile,
  useQueryString
} from "../libs";
import {
  validateUsername,
  ValidationError
} from "../libs/tdol-server/profile/validations";
import { IndexPageURL } from "./routes";

function UsernameUpdateForm() {
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState(SupportedCountryEnum.UNITED_STATES);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value.trim());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setDisabled(true);
    e.preventDefault();
    const usernameValidationResult = validateUsername(username);

    if (usernameValidationResult == ValidationError.TOOSHORT) {
      setError(
        `${username}은 너무 짧습니다. 2자~20자 길이의 닉네임을 정하세요.`
      );
    } else if (usernameValidationResult == ValidationError.TOOLONG) {
      setError(`${username}은 너무 깁니다. 2자~20자 길이의 닉네임을 정하세요.`);
    } else {
      await updateUserProfile({ username, country });
      setSuccess(true);
    }

    setDisabled(false);
  };

  return success ? (
    <Redirect
      to="/login-success?signinFinished=true&isNewUser=true"
      push={false}
    />
  ) : (
    <div className="mt-5">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="username">닉네임</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value.trim())
            }
            className="border border-gray-500 p-2 w-full rounded-lg"
          />
        </div>
        <div className="flex flex-col mt-5">
          <label htmlFor="country">국가</label>
          <select
            name="country"
            value={country}
            onChange={(e) =>
              setCountry(e.target.value.trim() as SupportedCountryEnum)
            }
            className="border border-gray-500 p-2 w-full rounded-lg"
          >
            <option value={SupportedCountryEnum.SOUTH_KOREA}>대한민국</option>
            <option value={SupportedCountryEnum.UNITED_STATES}>
              United States
            </option>
          </select>
        </div>

        {error !== "" ? <div>{error}</div> : <></>}
        <button
          type="submit"
          disabled={disabled}
          className={
            "w-full p-4 rounded-2xl transition duration-150 text-base font-semibold select-none mt-5 " +
            (disabled
              ? "text-white bg-gray-600 cursor-not-allowed"
              : "text-white bg-blue-500 hover:bg-blue-400 active:bg-blue-700 transform active:scale-95")
          }
        >
          정보 설정하기
        </button>
      </form>
    </div>
  );
}

export function LoginSuccessPage() {
  const isNewUser = useQueryString().get("isNewUser") === "true";
  const signinFinished = useQueryString().get("signinFinished") === "true";

  if (isNewUser === false) {
    return <Redirect to={IndexPageURL} />;
  }

  if (signinFinished === false) {
    return (
      <div className="w-screen h-screen bg-gray-100 text-black flex">
        <div className="m-auto bg-white p-6 rounded-2xl">
          <h1 className="text-2xl font-bold">사용자 정보 입력</h1>
          <p>새 사용자입니다. 정보를 입력하세요.</p>
          <UsernameUpdateForm />
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gray-100 text-black flex">
      <div className="m-auto bg-white p-6 rounded-2xl">
        <h1 className="text-2xl font-bold">가입 완료. 게임을 시작합니다!</h1>
        <Link
          to={IndexPageURL}
          replace={true}
          className="text-white w-full p-4 rounded-2xl transition duration-150 text-base font-semibold bg-blue-500 hover:bg-blue-400 active:bg-blue-700 select-none transform active:scale-95 mt-5 inline-block text-center"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
