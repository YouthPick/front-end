import { parseApiError } from '@/shared/api';

const POLICY_CHAT_ERROR_MESSAGE_BY_CODE: Record<string, string> = {
  A001: '로그인이 필요한 기능입니다. 다시 로그인한 뒤 이용해 주세요.',
  C001: '메시지는 1자 이상 1000자 이하로 입력해 주세요.',
  P001: '정책 정보를 찾을 수 없습니다.',
  P002: '현재 이 정책의 채팅을 이용할 수 없습니다.',
};

export const CHAT_CONNECTION_FALLBACK_MESSAGE =
  '채팅 연결이 원활하지 않습니다. 잠시 후 다시 연결을 시도합니다.';
export const CHAT_SEND_FALLBACK_MESSAGE = '메시지를 보내지 못했습니다. 잠시 후 다시 시도해 주세요.';
export const CHAT_AUTH_REQUIRED_MESSAGE =
  '로그인이 만료되었습니다. 다시 로그인한 뒤 이용해 주세요.';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function getPolicyChatErrorMessage(error: unknown, fallbackMessage: string): string {
  const apiError = parseApiError(error);
  if (!apiError) return fallbackMessage;
  return POLICY_CHAT_ERROR_MESSAGE_BY_CODE[apiError.code] ?? fallbackMessage;
}

export function parsePolicyChatErrorBody(body: string, fallbackMessage: string): string {
  const parsedBody: unknown = JSON.parse(body);
  if (!isRecord(parsedBody) || typeof parsedBody.code !== 'string') return fallbackMessage;
  return POLICY_CHAT_ERROR_MESSAGE_BY_CODE[parsedBody.code] ?? fallbackMessage;
}
