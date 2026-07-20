import { parseApiError } from '@/shared/api';

const ONBOARDING_ERROR_MESSAGE_BY_CODE: Record<string, string> = {
  C001: '입력값을 다시 확인해 주세요.',
  U001: '사용자 정보를 확인할 수 없습니다. 다시 로그인한 뒤 이용해 주세요.',
  U003: '이미 프로필 설정을 완료했습니다.',
  P003: '선택한 지역 정보를 찾을 수 없습니다. 지역을 다시 선택해 주세요.',
};

export function getOnboardingErrorMessage(error: unknown, fallbackMessage: string): string {
  const apiError = parseApiError(error);
  if (!apiError) return fallbackMessage;
  return ONBOARDING_ERROR_MESSAGE_BY_CODE[apiError.code] ?? fallbackMessage;
}
