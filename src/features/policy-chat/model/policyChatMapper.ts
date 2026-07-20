import type { PolicyChatMessageDto } from '../api/policyChat.dto';
import type { PolicyChatMessage } from './policyChat.types';

export function mapPolicyChatMessageDtoToMessage(dto: PolicyChatMessageDto): PolicyChatMessage {
  return {
    id: dto.id,
    policyId: dto.policyId,
    authorName: dto.authorName,
    content: dto.content,
    createdAt: dto.createdAt,
    mine: dto.mine,
    ...(dto.clientMessageId ? { clientMessageId: dto.clientMessageId } : {}),
  };
}

export function mapPolicyChatMessageDtosToMessages(
  dtos: PolicyChatMessageDto[],
): PolicyChatMessage[] {
  return dtos.map(mapPolicyChatMessageDtoToMessage);
}

export function mergePolicyChatMessages(
  currentMessages: PolicyChatMessage[],
  nextMessages: PolicyChatMessage[],
): PolicyChatMessage[] {
  if (nextMessages.length === 0) return currentMessages;

  const messagesById = new Map(currentMessages.map((message) => [message.id, message]));
  for (const message of nextMessages) {
    messagesById.set(message.id, message);
  }

  return [...messagesById.values()].sort((left, right) => left.id - right.id);
}

export function getNextPolicyChatCursor(
  currentCursor: number,
  messages: PolicyChatMessage[],
  responseCursor: number,
): number {
  const latestMessageId = messages.reduce(
    (latestId, message) => Math.max(latestId, message.id),
    currentCursor,
  );
  return Math.max(responseCursor, latestMessageId);
}
