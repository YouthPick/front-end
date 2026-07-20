export interface PolicyChatMessage {
  id: number;
  policyId: number;
  authorName: string;
  content: string;
  createdAt: string;
  mine: boolean;
  clientMessageId?: string;
}

export type PolicyChatStatus = 'idle' | 'loading' | 'ready' | 'error' | 'reconnecting';
