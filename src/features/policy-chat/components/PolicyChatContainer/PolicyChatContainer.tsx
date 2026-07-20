import { useAuthStore } from '@/entities/user';

import { usePolicyChat } from '../../hooks/usePolicyChat';
import {
  PolicyChatDisabledState,
  PolicyChatLoginRequiredState,
  PolicyChatPresenter,
} from './PolicyChatPresenter';

interface PolicyChatContainerProps {
  policyId: string;
}

// 정책 목록/상세가 실제 백엔드 API(#82)로 연동되면서 Policy.id는 항상 백엔드 정책의 숫자 id를
// 문자열로 담는다(policyMapper.ts 참고). 형식이 어긋나는 값만 방어적으로 걸러낸다.
function parseBackendPolicyId(policyId: string): number | null {
  if (!/^\d+$/.test(policyId)) return null;

  const parsedPolicyId = Number(policyId);
  if (!Number.isSafeInteger(parsedPolicyId) || parsedPolicyId <= 0) return null;

  return parsedPolicyId;
}

export function PolicyChatContainer({ policyId }: PolicyChatContainerProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const backendPolicyId = parseBackendPolicyId(policyId);
  const chat = usePolicyChat({
    policyId: backendPolicyId,
    enabled: isAuthenticated && backendPolicyId !== null,
  });

  if (!isAuthenticated) return <PolicyChatLoginRequiredState />;
  if (backendPolicyId === null) return <PolicyChatDisabledState />;

  return (
    <PolicyChatPresenter
      messages={chat.messages}
      status={chat.status}
      errorMessage={chat.errorMessage}
      isSending={chat.isSending}
      sendErrorMessage={chat.sendErrorMessage}
      onRetry={chat.retry}
      onSendMessage={chat.sendMessage}
    />
  );
}
