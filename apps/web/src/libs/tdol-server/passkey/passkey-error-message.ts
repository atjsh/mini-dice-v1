function getErrorMessage(error: any) {
  const responseMessage = error?.response?.data?.message;

  if (Array.isArray(responseMessage)) {
    return responseMessage.join(' ');
  }

  if (typeof responseMessage === 'string') {
    return responseMessage;
  }

  if (typeof error?.message === 'string') {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return '';
}

function alreadyKorean(message: string) {
  return /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(message);
}

export function normalizePasskeyErrorMessage(error: any, fallback: string) {
  const message = getErrorMessage(error).trim();

  if (message && alreadyKorean(message)) {
    return message;
  }

  const name = typeof error?.name === 'string' ? error.name : '';
  const normalized = `${name} ${message}`.toLowerCase();

  if (
    /notallowederror|not allowed|user denied|denied permission|permission/i.test(
      normalized,
    )
  ) {
    return '패스키 요청이 취소되었거나 브라우저에서 허용되지 않았습니다. 권한을 확인한 뒤 다시 시도해 주세요.';
  }

  if (/aborterror|aborted|cancel/i.test(normalized)) {
    return '패스키 요청이 취소되었습니다. 다시 시도해 주세요.';
  }

  if (/notsupportederror|not supported|unsupported/i.test(normalized)) {
    return '이 브라우저에서는 패스키를 사용할 수 없습니다. 최신 브라우저에서 다시 시도해 주세요.';
  }

  if (
    /invalidstateerror|already registered|already exists|excludecredentials/i.test(
      normalized,
    )
  ) {
    return '이미 등록된 패스키입니다. 다른 패스키를 사용해 주세요.';
  }

  if (/securityerror|rp id|relying party|origin/i.test(normalized)) {
    return '현재 주소에서 패스키 요청을 사용할 수 없습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.';
  }

  if (/networkerror|network/i.test(normalized)) {
    return '네트워크 오류로 패스키 요청을 완료하지 못했습니다. 다시 시도해 주세요.';
  }

  if (/maximum passkey limit/i.test(normalized)) {
    return '패스키는 최대 100개까지 등록할 수 있습니다.';
  }

  if (/webauthn is not configured/i.test(normalized)) {
    return '패스키 서버 설정이 완료되지 않았습니다.';
  }

  if (/challenge not found or expired/i.test(normalized)) {
    return '패스키 요청이 만료되었습니다. 다시 시도해 주세요.';
  }

  if (/passkey verification failed/i.test(normalized)) {
    return '패스키 확인에 실패했습니다. 다시 시도해 주세요.';
  }

  if (/passkey not found/i.test(normalized)) {
    return '패스키를 찾을 수 없습니다.';
  }

  if (/authentication failed/i.test(normalized)) {
    return '패스키 로그인에 실패했습니다. 다시 시도해 주세요.';
  }

  if (/request failed/i.test(normalized)) {
    return '요청을 처리하지 못했습니다. 다시 시도해 주세요.';
  }

  return fallback;
}
