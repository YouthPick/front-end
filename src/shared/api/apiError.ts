export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: Array<{
    field?: string;
    value?: unknown;
    reason?: string;
  }>;
}

const ERROR_MESSAGE_BY_CODE: Record<string, string> = {
  C001: "입력값을 다시 확인해 주세요.",
  A001: "로그인이 필요한 기능입니다.",
  P001: "정책 정보를 찾을 수 없습니다.",
};

const FALLBACK_ERROR_MESSAGE =
  "요청 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";

export function getUserMessage(error: ApiErrorResponse): string {
  return ERROR_MESSAGE_BY_CODE[error.code] ?? FALLBACK_ERROR_MESSAGE;
}

export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.code === "string" && typeof candidate.message === "string";
}
