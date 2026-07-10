import { apiClient } from '@/shared/api';

export interface ChatHistoryEntry {
  role: 'user' | 'bot';
  text: string;
}

export interface SendChatMessageResult {
  text: string;
  isFallback: boolean;
}

interface ChatResponseDto {
  text?: string;
}

// 챗봇 백엔드가 아직 없으므로(.claude/rules.md: 정적 SPA) 실패 시 안내 메시지로 degrade한다.
// 실제 챗봇 API가 생기면 이 파일만 교체하면 된다.
const FALLBACK_MESSAGE =
  '지금은 챗봇 응답 서버에 연결할 수 없어요. 궁금하신 정책은 [정책 찾기] 화면에서 키워드·지역 필터로 바로 검색하실 수 있습니다.';

export async function sendChatMessage(
  message: string,
  history: ChatHistoryEntry[],
): Promise<SendChatMessageResult> {
  try {
    const response = await apiClient.post<ChatResponseDto>('/chat', { message, history });
    const text = response.data.text;
    if (!text) {
      return { text: FALLBACK_MESSAGE, isFallback: true };
    }
    return { text, isFallback: false };
  } catch {
    return { text: FALLBACK_MESSAGE, isFallback: true };
  }
}
