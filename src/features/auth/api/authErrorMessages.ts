import type { ApiErrorResponse } from '@/shared/api';

// 백엔드 AuthErrorCode(A001~A008)를 사용자 메시지로 매핑한다. 원본 status/exception은 노출하지 않는다.
const AUTH_ERROR_MESSAGE_BY_CODE: Record<string, string> = {
  A001: '로그인이 필요합니다.',
  A002: '아이디 또는 비밀번호가 올바르지 않습니다.',
  A003: '지원하지 않는 로그인 방식입니다.',
  A004: '로그인 요청이 유효하지 않습니다. 다시 시도해 주세요.',
  A005: '소셜 로그인 서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
  A006: '로그인이 만료되었습니다. 다시 로그인해 주세요.',
  A007: '로그인이 만료되었습니다. 다시 로그인해 주세요.',
  A008: '접근 권한이 없습니다.',
};

const FALLBACK_MESSAGE = '로그인 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.';

export function getAuthErrorMessage(error: ApiErrorResponse | null): string {
  if (!error) return FALLBACK_MESSAGE;
  return AUTH_ERROR_MESSAGE_BY_CODE[error.code] ?? FALLBACK_MESSAGE;
}
