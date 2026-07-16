import type { ApiErrorResponse } from '@/shared/api';

// 백엔드 PolicyErrorCode 중 정책 비교 API가 실제로 내려주는 코드만 매핑한다.
const COMPARE_ERROR_MESSAGE_BY_CODE: Record<string, string> = {
  P001: '선택한 정책 중 더 이상 존재하지 않는 정책이 있습니다.',
  P006: '존재하지 않는 정책 비교입니다.',
};

const FALLBACK_MESSAGE = '정책 비교 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';

export function getCompareErrorMessage(error: ApiErrorResponse | null): string {
  if (!error) return FALLBACK_MESSAGE;
  return COMPARE_ERROR_MESSAGE_BY_CODE[error.code] ?? FALLBACK_MESSAGE;
}
