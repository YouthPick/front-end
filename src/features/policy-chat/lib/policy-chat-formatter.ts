import type { PolicyChatQueryDto } from "../api/policy-chat-api";

export function formatPolicyChatResponse(response: PolicyChatQueryDto): string {
  return `${response.message}\n\n정확한 신청 자격과 제출 서류는 반드시 공식 공고에서 다시 확인해 주세요.`;
}
