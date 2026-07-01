export interface ApiResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

export interface ApiErrorDetail {
  field?: string;
  value?: unknown;
  reason?: string;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: ApiErrorDetail[];
  errors?: ApiErrorDetail[];
  timestamp?: string;
}

const DEFAULT_API_BASE_URL = "";
const DEFAULT_ERROR_MESSAGE = "요청 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";

let unauthorizedHandler: (() => Promise<boolean>) | null = null;

const ERROR_MESSAGE_BY_CODE: Record<string, string> = {
  A001: "로그인이 필요합니다.",
  C001: "입력값을 다시 확인해 주세요.",
  C002: "요청한 작업을 현재 상태에서 처리할 수 없습니다.",
  J001: "정책 동기화 작업을 찾을 수 없습니다.",
  J002: "이미 실행 중인 정책 동기화 작업이 있습니다.",
  P001: "정책 정보를 찾을 수 없습니다.",
  P002: "정책 비교 결과를 찾을 수 없습니다.",
  S001: "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
  U001: "저장된 프로필을 찾을 수 없습니다.",
};

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly userMessage: string;
  readonly details: ApiErrorDetail[];

  constructor(status: number, errorBody?: ApiErrorResponse) {
    const details = normalizeDetails(errorBody);
    const userMessage = buildUserMessage(errorBody, details);
    super(userMessage);
    this.name = "ApiError";
    this.status = status;
    this.code = errorBody?.code;
    this.userMessage = userMessage;
    this.details = details;
  }

  static async fromResponse(response: Response): Promise<ApiError> {
    return new ApiError(response.status, await parseErrorBody(response));
  }
}

export function apiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL;
}

export function setUnauthorizedHandler(handler: (() => Promise<boolean>) | null): void {
  unauthorizedHandler = handler;
}

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetchWithAuthRetry(path, init);

  if (!response.ok) {
    throw await ApiError.fromResponse(response);
  }

  return response.json() as Promise<T>;
}

export async function requestNoContent(path: string, init?: RequestInit): Promise<void> {
  const response = await fetchWithAuthRetry(path, init);

  if (!response.ok) {
    throw await ApiError.fromResponse(response);
  }
}

async function fetchWithAuthRetry(path: string, init?: RequestInit): Promise<Response> {
  const response = await fetchJson(path, init);
  if (response.status !== 401 || !unauthorizedHandler) {
    return response;
  }

  const refreshed = await unauthorizedHandler();
  if (!refreshed) {
    return response;
  }
  return fetchJson(path, init);
}

function fetchJson(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${apiBaseUrl()}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
  });
}

function normalizeDetails(errorBody?: ApiErrorResponse): ApiErrorDetail[] {
  return errorBody?.details ?? errorBody?.errors ?? [];
}

function buildUserMessage(
  errorBody: ApiErrorResponse | undefined,
  details: ApiErrorDetail[],
): string {
  const baseMessage = errorBody?.code ? ERROR_MESSAGE_BY_CODE[errorBody.code] : undefined;
  const message = baseMessage ?? DEFAULT_ERROR_MESSAGE;
  if (errorBody?.code !== "C001" || details.length === 0) {
    return message;
  }

  const reasons = details
    .map((detail) => detail.reason)
    .filter((reason): reason is string => Boolean(reason?.trim()));

  if (reasons.length === 0) {
    return message;
  }

  return `${message} ${reasons.slice(0, 3).join(" / ")}`;
}

async function parseErrorBody(response: Response): Promise<ApiErrorResponse | undefined> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return undefined;
  }

  try {
    const body = await response.json();
    if (isApiErrorResponse(body)) {
      return body;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ApiErrorResponse>;
  return typeof candidate.code === "string" && typeof candidate.message === "string";
}
