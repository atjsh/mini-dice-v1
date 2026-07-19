import { startRegistration } from '@simplewebauthn/browser';
import type { PasskeyRegistrationResultDto } from '@packages/shared-types';
import { useMutation, useQueryClient } from 'react-query';
import {
  getRegistrationOptions,
  renamePasskey,
  verifyRegistration,
} from './passkey-api';
import { getPasskeyMetadata } from './passkey-metadata';
import { PasskeyListQueryKey } from './use-passkey-list.hook';

export type PasskeyNamingOutcome =
  | 'provider'
  | 'custom'
  | 'default'
  | 'rename-failed';

export type PasskeyRegistrationMutationResult = PasskeyRegistrationResultDto & {
  namingOutcome: PasskeyNamingOutcome;
};

function alertInvalidName(message: string) {
  try {
    window.alert(message);
  } catch {
    // The passkey is already registered. A blocked native dialog must not fail it.
  }
}

function promptForPasskeyName(): string | null {
  let requestedName: string | null;

  try {
    requestedName = window.prompt(
      '패스키를 구분할 이름을 입력하세요. (최대 100자)\n예: iCloud Keychain, Google Password Manager',
      'Passkey',
    );
  } catch {
    return null;
  }

  if (requestedName === null) {
    return null;
  }

  const normalizedName = requestedName.trim();
  if (normalizedName.length === 0) {
    alertInvalidName('패스키 이름을 입력해 주세요.');
    return null;
  }
  if (normalizedName.length > 100) {
    alertInvalidName('패스키 이름은 100자 이하여야 합니다.');
    return null;
  }

  return normalizedName === 'Passkey' ? null : normalizedName;
}

export const usePasskeyRegister = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (): Promise<PasskeyRegistrationMutationResult> => {
      const options = await getRegistrationOptions();
      const credential = await startRegistration(options);
      const registration = await verifyRegistration(credential);
      const metadata = await getPasskeyMetadata(registration.aaguid);

      if (metadata) {
        try {
          await renamePasskey(registration.passkeyId, metadata.name);
          return {
            ...registration,
            name: metadata.name,
            namingOutcome: 'provider',
          };
        } catch {
          return { ...registration, namingOutcome: 'rename-failed' };
        }
      }

      const requestedName = promptForPasskeyName();
      if (requestedName === null) {
        return { ...registration, namingOutcome: 'default' };
      }

      try {
        await renamePasskey(registration.passkeyId, requestedName);
        return {
          ...registration,
          name: requestedName,
          namingOutcome: 'custom',
        };
      } catch {
        return { ...registration, namingOutcome: 'rename-failed' };
      }
    },
    {
      onSuccess: () => queryClient.invalidateQueries(PasskeyListQueryKey),
    },
  );
};
