export interface PolicyChatMessageDto {
  id: number;
  policyId: number;
  authorName: string;
  content: string;
  createdAt: string;
  mine: boolean;
  clientMessageId?: string;
}

export interface PolicyChatMessagesResponseDto {
  messages: PolicyChatMessageDto[];
  nextCursor: number;
}
