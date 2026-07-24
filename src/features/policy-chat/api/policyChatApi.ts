import { apiClient } from '@/shared/api';

import type { PolicyChatMessagesResponseDto } from './policyChat.dto';

interface FetchPolicyChatMessagesParams {
  policyId: number;
  afterId: number;
  signal: AbortSignal;
}

export async function fetchPolicyChatMessages({
  policyId,
  afterId,
  signal,
}: FetchPolicyChatMessagesParams): Promise<PolicyChatMessagesResponseDto> {
  const response = await apiClient.get<{ data: PolicyChatMessagesResponseDto }>(
    `/v1/policies/${policyId}/chat/messages`,
    {
      params: { afterId },
      signal,
    },
  );

  return response.data.data;
}
