import { useCallback, useRef, useState } from 'react';

import type { PolicyChatMessage } from '../model/policyChat.types';
import { CHAT_SEND_FALLBACK_MESSAGE } from '../model/policyChatErrors';

const SEND_DELIVERY_TIMEOUT_MS = 10_000;

interface PendingPolicyChatSend {
  clientMessageId: string;
  resolve: (sent: boolean) => void;
  timeoutId: ReturnType<typeof setTimeout>;
}

interface StartedPolicyChatSend {
  clientMessageId: string;
  deliveryPromise: Promise<boolean>;
}

export interface PolicyChatPendingSendControls {
  isSending: boolean;
  sendErrorMessage: string | null;
  setIsSending: (isSending: boolean) => void;
  setSendErrorMessage: (message: string | null) => void;
  startPendingSend: () => StartedPolicyChatSend | null;
  completeDeliveredMessage: (message: PolicyChatMessage) => void;
  failPendingSend: (nextSendErrorMessage: string, updateState: boolean) => void;
}

function createClientMessageId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `policy-chat-message-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function usePolicyChatPendingSend(): PolicyChatPendingSendControls {
  const [sendErrorMessage, setSendErrorMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const pendingSendRef = useRef<PendingPolicyChatSend | null>(null);

  const settlePendingSend = useCallback(
    (sent: boolean, nextSendErrorMessage: string | null, updateState: boolean) => {
      const pendingSend = pendingSendRef.current;
      if (!pendingSend) {
        if (updateState && nextSendErrorMessage) setSendErrorMessage(nextSendErrorMessage);
        return;
      }

      pendingSendRef.current = null;
      clearTimeout(pendingSend.timeoutId);
      if (updateState) {
        setIsSending(false);
        setSendErrorMessage(sent ? null : nextSendErrorMessage);
      }
      pendingSend.resolve(sent);
    },
    [],
  );

  const startPendingSend = useCallback((): StartedPolicyChatSend | null => {
    if (pendingSendRef.current) {
      setSendErrorMessage(CHAT_SEND_FALLBACK_MESSAGE);
      return null;
    }

    setIsSending(true);
    setSendErrorMessage(null);
    const clientMessageId = createClientMessageId();
    const deliveryPromise = new Promise<boolean>((resolve) => {
      const timeoutId = setTimeout(() => {
        settlePendingSend(false, CHAT_SEND_FALLBACK_MESSAGE, true);
      }, SEND_DELIVERY_TIMEOUT_MS);
      pendingSendRef.current = { clientMessageId, resolve, timeoutId };
    });

    return { clientMessageId, deliveryPromise };
  }, [settlePendingSend]);

  const completeDeliveredMessage = useCallback(
    (message: PolicyChatMessage) => {
      if (
        message.mine &&
        message.clientMessageId &&
        message.clientMessageId === pendingSendRef.current?.clientMessageId
      ) {
        settlePendingSend(true, null, true);
      }
    },
    [settlePendingSend],
  );

  const failPendingSend = useCallback(
    (nextSendErrorMessage: string, updateState: boolean) => {
      settlePendingSend(false, nextSendErrorMessage, updateState);
    },
    [settlePendingSend],
  );

  return {
    isSending,
    sendErrorMessage,
    setIsSending,
    setSendErrorMessage,
    startPendingSend,
    completeDeliveredMessage,
    failPendingSend,
  };
}
