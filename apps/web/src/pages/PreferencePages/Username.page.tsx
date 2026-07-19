import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  SettingsActionButton,
  SettingsCard,
  SettingsNotice,
} from '../../components/settings';
import { ServiceLayout } from '../../layouts/service.layout';
import { useMutateUser, useUser } from '../../libs';
import {
  validateUsername,
  ValidationError,
} from '../../libs/tdol-server/profile/validations';
import { ProfilePreferencePageURL } from '../routes';

function getUsernameError(username: string) {
  if (username.length === 0) {
    return '닉네임을 입력해 주세요.';
  }

  const validationResult = validateUsername(username);
  if (validationResult === ValidationError.TOOSHORT) {
    return '닉네임은 2자 이상이어야 합니다.';
  }
  if (validationResult === ValidationError.TOOLONG) {
    return '닉네임은 20자 이하여야 합니다.';
  }

  return undefined;
}

export function UsernamePreferencePage() {
  const { data: user } = useUser();
  const updateUser = useMutateUser();
  const navigate = useNavigate();
  const currentUsername = user?.username ?? '';
  const [username, setUsername] = useState(currentUsername);
  const normalizedUsername = username.trim();
  const usernameError = getUsernameError(normalizedUsername);
  const isUnchanged = normalizedUsername === currentUsername;
  const isSubmitDisabled =
    usernameError !== undefined || isUnchanged || updateUser.isLoading;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    updateUser.mutate(
      { username: normalizedUsername },
      {
        onSuccess: () => {
          navigate(ProfilePreferencePageURL, { replace: true });
        },
      },
    );
  };

  return (
    <ServiceLayout>
      <div className="self-center m-auto w-full max-w-2xl">
        <div className="mb-6 flex flex-col gap-2">
          <Link
            className="break-all text-lg text-blue-500 hover:underline"
            to={ProfilePreferencePageURL}
          >
            ← {currentUsername ? `프로필: ${currentUsername}` : '프로필'}
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            닉네임 변경
          </h1>
        </div>

        <SettingsCard className="p-5">
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <label
                className="font-medium text-gray-900 dark:text-gray-100"
                htmlFor="username"
              >
                새 닉네임
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="nickname"
                required
                minLength={2}
                maxLength={20}
                value={username}
                aria-describedby="username-help"
                aria-invalid={usernameError !== undefined}
                onChange={(event) => {
                  setUsername(event.target.value);
                  if (updateUser.isError) {
                    updateUser.reset();
                  }
                }}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-lg text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-gray-100"
              />
              <p
                id="username-help"
                className={`mt-2 text-sm ${
                  usernameError
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {usernameError ??
                  (isUnchanged
                    ? '현재 닉네임과 같습니다.'
                    : '2자 이상 20자 이하로 입력해 주세요.')}
              </p>
            </div>

            {updateUser.isError && (
              <SettingsNotice tone="error" role="alert">
                닉네임을 변경하지 못했습니다. 다시 시도해 주세요.
              </SettingsNotice>
            )}

            <SettingsActionButton
              type="submit"
              disabled={isSubmitDisabled}
              className="self-start"
            >
              {updateUser.isLoading ? '변경 중…' : '변경하기'}
            </SettingsActionButton>
          </form>
        </SettingsCard>
      </div>
    </ServiceLayout>
  );
}
