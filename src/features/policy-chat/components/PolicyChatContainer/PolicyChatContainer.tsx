import { MOCK_POLICY_IDS } from '@/entities/policy';
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

function parseBackendPolicyId(policyId: string): number | null {
  if (MOCK_POLICY_IDS.has(policyId)) return null;
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
