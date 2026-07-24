import type { Client } from '@stomp/stompjs';
import type { RefObject } from 'react';
import { useCallback } from 'react';

import { getPolicyChatPublishDestination } from '../api/policyChatStomp';
import {
  CHAT_CONNECTION_FALLBACK_MESSAGE,
  CHAT_SEND_FALLBACK_MESSAGE,
} from '../model/policyChatErrors';
import type { PolicyChatPendingSendControls } from './usePolicyChatPendingSend';

interface UsePolicyChatSendMessageParams {
  clientRef: RefObject<Client | null>;
  enabled: boolean;
  policyId: number | null;
  pendingSend: PolicyChatPendingSendControls;
}

export function usePolicyChatSendMessage({
  clientRef,
  enabled,
  policyId,
  pendingSend,
}: UsePolicyChatSendMessageParams) {
  return useCallback(
    async (content: string): Promise<boolean> => {
      const trimmedContent = content.trim();
      if (
        !enabled ||
        policyId === null ||
        trimmedContent.length === 0 ||
        trimmedContent.length > 1000
      ) {
        return false;
      }

      const client = clientRef.current;
      if (!client?.connected) {
        pendingSend.setSendErrorMessage(CHAT_CONNECTION_FALLBACK_MESSAGE);
        return false;
      }

      const startedSend = pendingSend.startPendingSend();
      if (!startedSend) return false;

      try {
        client.publish({
          destination: getPolicyChatPublishDestination(policyId),
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            content: trimmedContent,
            clientMessageId: startedSend.clientMessageId,
          }),
        });
        return await startedSend.deliveryPromise;
      } catch {
        pendingSend.failPendingSend(CHAT_SEND_FALLBACK_MESSAGE, true);
        return false;
      }
    },
    [clientRef, enabled, policyId, pendingSend],
  );
}
