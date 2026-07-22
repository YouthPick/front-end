const ACCESS_DENIED_MESSAGE = '로그인을 취소하셨습니다. 원하실 때 다시 시도해 주세요.';
const PROVIDER_ERROR_MESSAGE =
  '소셜 로그인 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.';

// OAuth 제공사의 error_description은 내부 정보가 포함될 수 있으므로 사용자에게 그대로 노출하지 않는다.
export function getOAuthCallbackErrorMessage(error: string | null): string | null {
  if (!error) return null;
  return error === 'access_denied' ? ACCESS_DENIED_MESSAGE : PROVIDER_ERROR_MESSAGE;
}
