import type { PolicyChatMessageDto } from './policyChat.dto';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isPolicyChatMessageDto(value: unknown): value is PolicyChatMessageDto {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.policyId === 'number' &&
    typeof value.authorName === 'string' &&
    typeof value.content === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.mine === 'boolean' &&
    (value.clientMessageId === undefined || typeof value.clientMessageId === 'string')
  );
}

export function parsePolicyChatMessageBody(body: string): PolicyChatMessageDto | null {
  const parsedBody: unknown = JSON.parse(body);
  if (!isPolicyChatMessageDto(parsedBody)) return null;
  return parsedBody;
}

export function getPolicyChatWebSocketUrl(): string {
  const apiRoot = API_BASE_URL.replace(/\/$/, '');
  const apiUrl = new URL(`${apiRoot}/ws`, window.location.origin);
  apiUrl.protocol = apiUrl.protocol === 'https:' ? 'wss:' : 'ws:';
  return apiUrl.toString();
}

export function getPolicyChatMessageDestination(policyId: number): string {
  return `/user/queue/policies/${policyId}/chat/messages`;
}

export function getPolicyChatErrorDestination(policyId: number): string {
  return `/user/queue/policies/${policyId}/chat/errors`;
}

export function getPolicyChatPublishDestination(policyId: number): string {
  return `/app/policies/${policyId}/chat/messages`;
}
