import type { PolicyChatMessage, PolicyChatStatus } from '../model/policyChat.types';

export interface UsePolicyChatParams {
  policyId: number | null;
  enabled: boolean;
}

export interface UsePolicyChatResult {
  messages: PolicyChatMessage[];
  status: PolicyChatStatus;
  errorMessage: string | null;
  isSending: boolean;
  sendErrorMessage: string | null;
  retry: () => void;
  sendMessage: (content: string) => Promise<boolean>;
}
