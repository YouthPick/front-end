import axios from 'axios';

export interface ApiFieldErrorDetail {
  field?: string;
  value?: string;
  reason?: string;
}

export interface ApiErrorResponse {
  status: number;
  code: string;
  message: string;
  errors: ApiFieldErrorDetail[];
  timestamp: string;
}

// 백엔드 공통 에러 응답(global.error.ErrorResponse)에서 code/message를 꺼낸다.
// 실패 원인이 이 형태가 아니면(네트워크 단절 등) null을 반환해 호출부가 공통 fallback 메시지를 쓰게 한다.
export function parseApiError(error: unknown): ApiErrorResponse | null {
  if (!axios.isAxiosError(error) || !error.response) return null;

  const data: unknown = error.response.data;
  if (typeof data !== 'object' || data === null) return null;
  if (!('code' in data) || typeof (data as { code: unknown }).code !== 'string') return null;

  return data as ApiErrorResponse;
}
