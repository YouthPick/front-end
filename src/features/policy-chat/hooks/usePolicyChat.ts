import {
  Client,
  type IMessage,
  ReconnectionTimeMode,
  type StompSubscription,
} from '@stomp/stompjs';
import { useCallback, useEffect, useRef, useState } from 'react';

import { notifySessionExpired } from '@/shared/api';
import { fetchPolicyChatMessages } from '../api/policyChatApi';
import {
  getFreshPolicyChatAccessToken,
  isPolicyChatSessionInvalidError,
} from '../api/policyChatAuth';
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
    hasPendingSend,
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

    const activePolicyId = policyId;
    const abortController = new AbortController();
    const subscriptions: StompSubscription[] = [];
    let isDisposed = false;
    let hasConnected = false;
    let hasLoadedHistory = false;
    let shouldForceTokenRefresh = false;

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
          policyId: activePolicyId,
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
        if (!dto || dto.policyId !== activePolicyId || !isActiveSession()) return;

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
      // 대기 중인 전송이 없으면 지연 도착한(또는 다른 요청의) 에러 프레임이므로 무시한다.
      if (!hasPendingSend()) return;

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
          const token = await getFreshPolicyChatAccessToken(shouldForceTokenRefresh);
          shouldForceTokenRefresh = false;
          if (!isActiveSession()) return;

          client.connectHeaders = { Authorization: `Bearer ${token}` };
        } catch (error) {
          if (!isActiveSession()) return;
          // refresh token 자체가 무효한 경우에만 세션을 만료 처리한다. 네트워크 단절/서버 5xx 같은
          // 일시적 오류까지 notifySessionExpired를 호출하면 위젯 마운트만으로 앱 전체가 로그아웃된다.
          if (isPolicyChatSessionInvalidError(error)) {
            setErrorMessage(CHAT_AUTH_REQUIRED_MESSAGE);
            setStatus('error');
            notifySessionExpired();
          } else {
            setErrorMessage(CHAT_CONNECTION_FALLBACK_MESSAGE);
            setStatus(hasConnected || hasLoadedHistory ? 'reconnecting' : 'error');
          }
          void client.deactivate({ force: true });
        }
      },
      onConnect: () => {
        if (!isActiveSession()) return;

        hasConnected = true;
        subscriptions.push(
          client.subscribe(getPolicyChatMessageDestination(activePolicyId), handleIncomingMessage),
          client.subscribe(getPolicyChatErrorDestination(activePolicyId), handlePolicyChatError),
        );
        const initialHistoryCursor = fetchHistoryDelta(cursorRef.current);
        void initialHistoryCursor.then((afterInitialHistoryId) => {
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
        setStatus(hasConnected || hasLoadedHistory ? 'reconnecting' : 'error');
        // STOMP CONNECT가 거부된 경우일 수 있으니 다음 재연결에서는 캐시된 토큰을 재사용하지 않고
        // 강제로 새 토큰을 발급받아, 서버 측 세션 무효화를 무한 재연결 없이 감지한다.
        shouldForceTokenRefresh = true;
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
        setStatus(hasConnected || hasLoadedHistory ? 'reconnecting' : 'error');
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      isDisposed = true;
      abortController.abort();
      failPendingSend(CHAT_SEND_FALLBACK_MESSAGE, false);
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
    hasPendingSend,
    setIsSending,
    setSendErrorMessage,
  ]);

  const retry = useCallback(() => {
    setChatSessionId((sessionId) => sessionId + 1);
  }, []);

  const sendMessage = usePolicyChatSendMessage({ clientRef, enabled, policyId, pendingSend });

  return { messages, status, errorMessage, isSending, sendErrorMessage, retry, sendMessage };
}
