import {
  Client,
  type IMessage,
  ReconnectionTimeMode,
  type StompSubscription,
} from '@stomp/stompjs';
import { useCallback, useEffect, useRef, useState } from 'react';

import { notifySessionExpired } from '@/shared/api';
import { fetchPolicyChatMessages } from '../api/policyChatApi';
import { getFreshPolicyChatAccessToken } from '../api/policyChatAuth';
import { createPolicyChatReceiptId, waitForPolicyChatReceipt } from '../api/policyChatReceipts';
import {
  getPolicyChatErrorDestination,
  getPolicyChatMessageDestination,
  getPolicyChatWebSocketUrl,
  parsePolicyChatMessageBody,
} from '../api/policyChatStomp';
import type { PolicyChatMessage, PolicyChatStatus } from '../model/policyChat.types';
import {
  CHAT_AUTH_REQUIRED_MESSAGE,
  CHAT_CONNECTION_FALLBACK_MESSAGE,
  CHAT_SEND_FALLBACK_MESSAGE,
  getPolicyChatErrorMessage,
  parsePolicyChatErrorBody,
} from '../model/policyChatErrors';
import {
  getNextPolicyChatCursor,
  mapPolicyChatMessageDtosToMessages,
  mapPolicyChatMessageDtoToMessage,
  mergePolicyChatMessages,
} from '../model/policyChatMapper';
import type { UsePolicyChatParams, UsePolicyChatResult } from './usePolicyChat.types';
import { usePolicyChatPendingSend } from './usePolicyChatPendingSend';
import { usePolicyChatSendMessage } from './usePolicyChatSendMessage';

const INITIAL_RETRY_DELAY_MS = 1_000;
const MAX_RETRY_DELAY_MS = 10_000;
const SUBSCRIPTION_RECEIPT_TIMEOUT_MS = 10_000;

export function usePolicyChat({ policyId, enabled }: UsePolicyChatParams): UsePolicyChatResult {
  const [messages, setMessages] = useState<PolicyChatMessage[]>([]);
  const [status, setStatus] = useState<PolicyChatStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [chatSessionId, setChatSessionId] = useState(0);
  const cursorRef = useRef(0);
  const clientRef = useRef<Client | null>(null);
  const pendingSend = usePolicyChatPendingSend();
  const {
    isSending,
    sendErrorMessage,
    setIsSending,
    setSendErrorMessage,
    completeDeliveredMessage,
    failPendingSend,
  } = pendingSend;

  useEffect(() => {
    if (!enabled || policyId === null) {
      cursorRef.current = 0;
      failPendingSend(CHAT_SEND_FALLBACK_MESSAGE, false);
      void clientRef.current?.deactivate({ force: true });
      clientRef.current = null;
      if (chatSessionId !== 0) setChatSessionId(0);
      setMessages([]);
      setStatus('idle');
      setErrorMessage(null);
      setSendErrorMessage(null);
      setIsSending(false);
      return;
    }

    const abortController = new AbortController();
    const subscriptions: StompSubscription[] = [];
    const cancelReceiptWaiters: Array<() => void> = [];
    let isDisposed = false;
    let hasConnected = false;
    let hasLoadedHistory = false;

    cursorRef.current = 0;
    setMessages([]);
    setStatus('loading');
    setErrorMessage(null);
    setSendErrorMessage(null);

    function isActiveSession(): boolean {
      return !isDisposed && !abortController.signal.aborted;
    }

    async function fetchHistoryDelta(afterId: number): Promise<number | null> {
      try {
        const response = await fetchPolicyChatMessages({
          policyId,
          afterId,
          signal: abortController.signal,
        });

        if (!isActiveSession()) return null;

        const nextMessages = mapPolicyChatMessageDtosToMessages(response.messages);
        const responseCursor = getNextPolicyChatCursor(afterId, nextMessages, response.nextCursor);
        cursorRef.current = Math.max(cursorRef.current, responseCursor);
        setMessages((currentMessages) => mergePolicyChatMessages(currentMessages, nextMessages));
        setStatus('ready');
        setErrorMessage(null);
        hasLoadedHistory = true;
        return responseCursor;
      } catch (error) {
        if (!isActiveSession()) return null;
        setErrorMessage(getPolicyChatErrorMessage(error, CHAT_CONNECTION_FALLBACK_MESSAGE));
        setStatus(hasLoadedHistory ? 'reconnecting' : 'error');
        return null;
      }
    }

    function handleIncomingMessage(message: IMessage) {
      try {
        const dto = parsePolicyChatMessageBody(message.body);
        if (!dto || dto.policyId !== policyId || !isActiveSession()) return;

        const nextMessage = mapPolicyChatMessageDtoToMessage(dto);
        cursorRef.current = Math.max(cursorRef.current, nextMessage.id);
        setMessages((currentMessages) => mergePolicyChatMessages(currentMessages, [nextMessage]));
        setStatus('ready');
        setErrorMessage(null);
        completeDeliveredMessage(nextMessage);
      } catch {
        if (!isActiveSession()) return;
        setErrorMessage(CHAT_CONNECTION_FALLBACK_MESSAGE);
        setStatus('reconnecting');
      }
    }

    function handlePolicyChatError(message: IMessage) {
      let nextSendErrorMessage = CHAT_SEND_FALLBACK_MESSAGE;
      try {
        nextSendErrorMessage = parsePolicyChatErrorBody(message.body, CHAT_SEND_FALLBACK_MESSAGE);
      } catch {
        nextSendErrorMessage = CHAT_SEND_FALLBACK_MESSAGE;
      }
      setSendErrorMessage(nextSendErrorMessage);
      failPendingSend(nextSendErrorMessage, true);
    }

    const client = new Client({
      brokerURL: getPolicyChatWebSocketUrl(),
      reconnectDelay: INITIAL_RETRY_DELAY_MS,
      maxReconnectDelay: MAX_RETRY_DELAY_MS,
      reconnectTimeMode: ReconnectionTimeMode.EXPONENTIAL,
      connectionTimeout: MAX_RETRY_DELAY_MS,
      heartbeatIncoming: 10_000,
      heartbeatOutgoing: 10_000,
      beforeConnect: async () => {
        try {
          const token = await getFreshPolicyChatAccessToken();
          if (!isActiveSession()) return;

          client.connectHeaders = { Authorization: `Bearer ${token}` };
        } catch {
          if (!isActiveSession()) return;
          setErrorMessage(CHAT_AUTH_REQUIRED_MESSAGE);
          setStatus('error');
          notifySessionExpired();
          void client.deactivate({ force: true });
        }
      },
      onConnect: () => {
        if (!isActiveSession()) return;

        hasConnected = true;
        const messageReceiptId = createPolicyChatReceiptId(policyId, 'messages');
        const errorReceiptId = createPolicyChatReceiptId(policyId, 'errors');
        const messageReceipt = waitForPolicyChatReceipt(
          client,
          messageReceiptId,
          isActiveSession,
          SUBSCRIPTION_RECEIPT_TIMEOUT_MS,
        );
        const errorReceipt = waitForPolicyChatReceipt(
          client,
          errorReceiptId,
          isActiveSession,
          SUBSCRIPTION_RECEIPT_TIMEOUT_MS,
        );
        cancelReceiptWaiters.push(messageReceipt.cancel, errorReceipt.cancel);

        subscriptions.push(
          client.subscribe(getPolicyChatMessageDestination(policyId), handleIncomingMessage, {
            receipt: messageReceiptId,
          }),
          client.subscribe(getPolicyChatErrorDestination(policyId), handlePolicyChatError, {
            receipt: errorReceiptId,
          }),
        );
        const initialHistoryCursor = fetchHistoryDelta(0);
        void Promise.all([messageReceipt.confirmed, errorReceipt.confirmed]).then(async () => {
          if (!isActiveSession()) return;
          const afterInitialHistoryId = await initialHistoryCursor;
          if (afterInitialHistoryId === null || !isActiveSession()) return;
          void fetchHistoryDelta(afterInitialHistoryId);
        });
      },
      onStompError: (frame) => {
        if (!isActiveSession()) return;
        try {
          setErrorMessage(parsePolicyChatErrorBody(frame.body, CHAT_CONNECTION_FALLBACK_MESSAGE));
        } catch {
          setErrorMessage(CHAT_CONNECTION_FALLBACK_MESSAGE);
        }
        failPendingSend(CHAT_SEND_FALLBACK_MESSAGE, true);
        setStatus(hasLoadedHistory ? 'reconnecting' : 'error');
      },
      onWebSocketClose: () => {
        if (!isActiveSession()) return;
        setErrorMessage(CHAT_CONNECTION_FALLBACK_MESSAGE);
        failPendingSend(CHAT_SEND_FALLBACK_MESSAGE, true);
        setStatus(hasConnected || hasLoadedHistory ? 'reconnecting' : 'error');
      },
      onWebSocketError: () => {
        if (!isActiveSession()) return;
        setErrorMessage(CHAT_CONNECTION_FALLBACK_MESSAGE);
        failPendingSend(CHAT_SEND_FALLBACK_MESSAGE, true);
        setStatus(hasLoadedHistory ? 'reconnecting' : 'error');
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      isDisposed = true;
      abortController.abort();
      failPendingSend(CHAT_SEND_FALLBACK_MESSAGE, false);
      for (const cancelReceiptWaiter of cancelReceiptWaiters) cancelReceiptWaiter();
      for (const subscription of subscriptions) subscription.unsubscribe();
      if (clientRef.current === client) clientRef.current = null;
      void client.deactivate({ force: true });
    };
  }, [
    enabled,
    policyId,
    chatSessionId,
    completeDeliveredMessage,
    failPendingSend,
    setIsSending,
    setSendErrorMessage,
  ]);

  const retry = useCallback(() => {
    setChatSessionId((sessionId) => sessionId + 1);
  }, []);

  const sendMessage = usePolicyChatSendMessage({ clientRef, enabled, policyId, pendingSend });

  return { messages, status, errorMessage, isSending, sendErrorMessage, retry, sendMessage };
}
