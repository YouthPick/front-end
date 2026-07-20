import { act, cleanup, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  CHAT_CONNECTION_FALLBACK_MESSAGE,
  CHAT_SEND_FALLBACK_MESSAGE,
} from '../model/policyChatErrors';
import {
  finishPolicyChatBeforeConnect,
  getPolicyChatReceiptIds,
  type MockClientConfig,
  MockStompClient,
  makePolicyChatMessageDto,
  makePolicyChatTestJwt,
  POLICY_CHAT_TEST_ERROR_DESTINATION,
  POLICY_CHAT_TEST_MESSAGE_DESTINATION,
  POLICY_CHAT_TEST_POLICY_ID,
  POLICY_CHAT_TEST_VALIDATION_ERROR_MESSAGE,
  renderConnectedPolicyChat,
  renderPolicyChatTestHook,
} from './usePolicyChatTestHelpers';

const stompMock = vi.hoisted(() => {
  const clients: MockStompClient[] = [];
  return {
    clients,
    Client: vi.fn(function createMockStompClient(config: MockClientConfig) {
      const client = new MockStompClient(config);
      clients.push(client);
      return client;
    }),
    ReconnectionTimeMode: { EXPONENTIAL: 'EXPONENTIAL' },
  };
});

const sharedApiMock = vi.hoisted(() => ({
  getAccessToken: vi.fn<() => string | null>(),
  requestNewAccessToken: vi.fn<() => Promise<string>>(),
  notifySessionExpired: vi.fn<() => void>(),
}));

const policyChatApiMock = vi.hoisted(() => ({
  fetchPolicyChatMessages: vi.fn(),
}));

vi.mock('@stomp/stompjs', () => ({
  Client: stompMock.Client,
  ReconnectionTimeMode: stompMock.ReconnectionTimeMode,
}));

vi.mock('@/shared/api', () => sharedApiMock);

vi.mock('../api/policyChatApi', () => policyChatApiMock);

function latestClient(): MockStompClient {
  const client = stompMock.clients.at(-1);
  if (!client) throw new Error('Expected STOMP client to be created');
  return client;
}

function createAxiosLikeError(status: number | undefined): unknown {
  return Object.assign(new Error('request failed'), {
    isAxiosError: true,
    response: status === undefined ? undefined : { status },
  });
}

describe('usePolicyChat STOMP lifecycle', () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.stubGlobal('crypto', { randomUUID: vi.fn(() => 'client-message-1') });
    stompMock.clients.length = 0;
    stompMock.Client.mockClear();
    sharedApiMock.getAccessToken.mockReturnValue(makePolicyChatTestJwt(600));
    sharedApiMock.requestNewAccessToken.mockResolvedValue(makePolicyChatTestJwt(600));
    sharedApiMock.notifySessionExpired.mockClear();
    policyChatApiMock.fetchPolicyChatMessages.mockReset();
    policyChatApiMock.fetchPolicyChatMessages.mockResolvedValue({ messages: [], nextCursor: 0 });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('uses the current valid access token before connecting without refreshing it', async () => {
    const currentToken = makePolicyChatTestJwt(600);
    sharedApiMock.getAccessToken.mockReturnValue(currentToken);

    renderPolicyChatTestHook();
    const client = latestClient();

    await finishPolicyChatBeforeConnect(client);

    expect(sharedApiMock.requestNewAccessToken).not.toHaveBeenCalled();
    expect(sharedApiMock.notifySessionExpired).not.toHaveBeenCalled();
    expect(client.connectHeaders.Authorization).toBe(`Bearer ${currentToken}`);
  });

  it('refreshes a missing or expired access token before connecting', async () => {
    const refreshedToken = makePolicyChatTestJwt(600);
    sharedApiMock.getAccessToken.mockReturnValueOnce(makePolicyChatTestJwt(-60));
    sharedApiMock.requestNewAccessToken.mockResolvedValue(refreshedToken);

    renderPolicyChatTestHook();
    const client = latestClient();

    await finishPolicyChatBeforeConnect(client);

    expect(sharedApiMock.requestNewAccessToken).toHaveBeenCalledTimes(1);
    expect(sharedApiMock.notifySessionExpired).not.toHaveBeenCalled();
    expect(client.connectHeaders.Authorization).toBe(`Bearer ${refreshedToken}`);
  });

  it('expires the session only when refresh token itself is rejected (401) before connecting', async () => {
    sharedApiMock.getAccessToken.mockReturnValue(null);
    sharedApiMock.requestNewAccessToken.mockRejectedValue(createAxiosLikeError(401));

    const { result } = renderPolicyChatTestHook();
    const client = latestClient();

    await finishPolicyChatBeforeConnect(client);

    expect(sharedApiMock.requestNewAccessToken).toHaveBeenCalledTimes(1);
    expect(sharedApiMock.notifySessionExpired).toHaveBeenCalledTimes(1);
    expect(client.deactivate).toHaveBeenCalledWith({ force: true });
    expect(result.current.status).toBe('error');
  });

  it('does not log the user out when token refresh fails transiently (network/5xx)', async () => {
    sharedApiMock.getAccessToken.mockReturnValue(null);
    sharedApiMock.requestNewAccessToken.mockRejectedValue(createAxiosLikeError(undefined));

    const { result } = renderPolicyChatTestHook();
    const client = latestClient();

    await finishPolicyChatBeforeConnect(client);

    expect(sharedApiMock.requestNewAccessToken).toHaveBeenCalledTimes(1);
    expect(sharedApiMock.notifySessionExpired).not.toHaveBeenCalled();
    expect(client.deactivate).toHaveBeenCalledWith({ force: true });
    expect(result.current.status).toBe('error');
  });

  it('forces a fresh token refresh after a STOMP-level connection rejection', async () => {
    const { client } = await renderConnectedPolicyChat({
      getClient: latestClient,
      historyMock: policyChatApiMock,
    });

    await act(async () => {
      client.emitStompError('');
    });

    // 로컬에서는 여전히 만료 전으로 보이는 토큰이라도, STOMP 연결 거부 뒤에는 캐시를 재사용하지 않고
    // 다시 발급받아야 서버 측 세션 무효화를 무한 재연결 없이 감지할 수 있다.
    sharedApiMock.requestNewAccessToken.mockClear();
    await act(async () => {
      client.activate();
      await client.finishBeforeConnect();
    });

    expect(sharedApiMock.requestNewAccessToken).toHaveBeenCalledTimes(1);
  });

  it('starts initial history immediately after issuing message and error subscriptions', async () => {
    const { result } = renderPolicyChatTestHook();
    const client = latestClient();

    await act(async () => {
      await client.finishBeforeConnect();
      client.connect();
    });

    expect(client.subscriptions).toHaveLength(2);
    const [messageSubscription, errorSubscription] = client.subscriptions;
    expect(messageSubscription?.destination).toBe(POLICY_CHAT_TEST_MESSAGE_DESTINATION);
    expect(errorSubscription?.destination).toBe(POLICY_CHAT_TEST_ERROR_DESTINATION);

    await waitFor(() => expect(policyChatApiMock.fetchPolicyChatMessages).toHaveBeenCalledTimes(1));
    expect(policyChatApiMock.fetchPolicyChatMessages).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ afterId: 0, policyId: POLICY_CHAT_TEST_POLICY_ID }),
    );
    expect(result.current.status).toBe('ready');
  });

  it('starts the safety delta only after both subscription receipts settle', async () => {
    renderPolicyChatTestHook();
    const client = latestClient();

    await act(async () => {
      await client.finishBeforeConnect();
      client.connect();
    });

    await waitFor(() => expect(policyChatApiMock.fetchPolicyChatMessages).toHaveBeenCalledTimes(1));
    const [messageReceiptId, errorReceiptId] = getPolicyChatReceiptIds(client);

    await act(async () => {
      client.emitReceipt(messageReceiptId);
    });
    expect(policyChatApiMock.fetchPolicyChatMessages).toHaveBeenCalledTimes(1);

    await act(async () => {
      client.emitReceipt(errorReceiptId);
    });
    await waitFor(() => expect(policyChatApiMock.fetchPolicyChatMessages).toHaveBeenCalledTimes(2));
    expect(policyChatApiMock.fetchPolicyChatMessages).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ afterId: 0, policyId: POLICY_CHAT_TEST_POLICY_ID }),
    );
  });

  it('shows empty chat before timers advance when STOMP subscription receipts never arrive', async () => {
    vi.useFakeTimers();
    const { result } = renderPolicyChatTestHook();
    const client = latestClient();

    await act(async () => {
      await client.finishBeforeConnect();
      client.connect();
    });

    expect(client.subscriptions).toHaveLength(2);
    await act(async () => {
      await Promise.resolve();
    });

    expect(policyChatApiMock.fetchPolicyChatMessages).toHaveBeenCalledTimes(1);
    expect(result.current.status).toBe('ready');
    expect(result.current.messages).toEqual([]);
  });

  it('surfaces a reconnecting error instead of silently treating a subscription receipt timeout as success', async () => {
    vi.useFakeTimers();
    const { result } = renderPolicyChatTestHook();
    const client = latestClient();

    await act(async () => {
      await client.finishBeforeConnect();
      client.connect();
    });
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.status).toBe('ready');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10_000);
    });

    expect(result.current.status).toBe('reconnecting');
    expect(result.current.errorMessage).toBe(CHAT_CONNECTION_FALLBACK_MESSAGE);
  });

  it('uses the initial-history cursor for receipt delta after a later live message arrives', async () => {
    policyChatApiMock.fetchPolicyChatMessages
      .mockResolvedValueOnce({ messages: [makePolicyChatMessageDto(5, 'initial')], nextCursor: 5 })
      .mockResolvedValueOnce({
        messages: [makePolicyChatMessageDto(6, 'race gap')],
        nextCursor: 10,
      });
    const { result } = renderPolicyChatTestHook();
    const client = latestClient();

    await act(async () => {
      await client.finishBeforeConnect();
      client.connect();
    });
    await waitFor(() => expect(policyChatApiMock.fetchPolicyChatMessages).toHaveBeenCalledTimes(1));

    await act(async () => {
      client.emitMessage(
        POLICY_CHAT_TEST_MESSAGE_DESTINATION,
        makePolicyChatMessageDto(10, 'live'),
      );
    });

    expect(result.current.messages.map((message) => message.id)).toEqual([5, 10]);
    const [messageReceiptId, errorReceiptId] = getPolicyChatReceiptIds(client);

    await act(async () => {
      client.emitReceipt(messageReceiptId);
      client.emitReceipt(errorReceiptId);
    });

    await waitFor(() => expect(policyChatApiMock.fetchPolicyChatMessages).toHaveBeenCalledTimes(2));
    expect(policyChatApiMock.fetchPolicyChatMessages).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ afterId: 5, policyId: POLICY_CHAT_TEST_POLICY_ID }),
    );
    expect(result.current.messages.map((message) => message.id)).toEqual([5, 6, 10]);
  });

  it('resumes from the last known cursor instead of refetching all history on reconnect', async () => {
    policyChatApiMock.fetchPolicyChatMessages.mockResolvedValueOnce({
      messages: [makePolicyChatMessageDto(7, 'first')],
      nextCursor: 7,
    });

    renderPolicyChatTestHook();
    const client = latestClient();

    await act(async () => {
      await client.finishBeforeConnect();
      client.connect();
    });
    await waitFor(() => expect(policyChatApiMock.fetchPolicyChatMessages).toHaveBeenCalledTimes(1));

    // stompjs가 내부적으로 재연결하면 같은 client 인스턴스에서 onConnect가 다시 호출된다.
    policyChatApiMock.fetchPolicyChatMessages.mockResolvedValueOnce({
      messages: [],
      nextCursor: 7,
    });
    await act(async () => {
      client.connect();
    });

    await waitFor(() => expect(policyChatApiMock.fetchPolicyChatMessages).toHaveBeenCalledTimes(2));
    expect(policyChatApiMock.fetchPolicyChatMessages).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ afterId: 7, policyId: POLICY_CHAT_TEST_POLICY_ID }),
    );
  });

  it('resolves send success only after the broker delivers the matching author message', async () => {
    const { client, result } = await renderConnectedPolicyChat({
      getClient: latestClient,
      historyMock: policyChatApiMock,
    });

    let sendResult = Promise.resolve(false);
    await act(async () => {
      sendResult = result.current.sendMessage(' hello ');
    });

    expect(result.current.isSending).toBe(true);
    expect(client.published).toHaveLength(1);
    expect(JSON.parse(client.published[0]?.body ?? '{}')).toEqual({
      content: 'hello',
      clientMessageId: 'client-message-1',
    });

    await act(async () => {
      client.emitMessage(POLICY_CHAT_TEST_MESSAGE_DESTINATION, {
        id: 10,
        policyId: POLICY_CHAT_TEST_POLICY_ID,
        authorName: '나',
        content: 'hello',
        createdAt: '2026-01-01T00:00:00.000Z',
        mine: true,
        clientMessageId: 'client-message-1',
      });
    });

    await expect(sendResult).resolves.toBe(true);
    expect(result.current.isSending).toBe(false);
    expect(result.current.messages).toHaveLength(1);
  });

  it('resolves send failure on server error and leaves sending state', async () => {
    const { client, result } = await renderConnectedPolicyChat({
      getClient: latestClient,
      historyMock: policyChatApiMock,
    });

    let sendResult = Promise.resolve(false);
    await act(async () => {
      sendResult = result.current.sendMessage('hello');
    });

    await act(async () => {
      client.emitRawMessage(POLICY_CHAT_TEST_ERROR_DESTINATION, JSON.stringify({ code: 'C001' }));
    });

    await expect(sendResult).resolves.toBe(false);
    expect(result.current.isSending).toBe(false);
    expect(result.current.sendErrorMessage).toBe(POLICY_CHAT_TEST_VALIDATION_ERROR_MESSAGE);
  });

  it('ignores a stray error-queue frame that does not correlate with any pending send', async () => {
    const { client, result } = await renderConnectedPolicyChat({
      getClient: latestClient,
      historyMock: policyChatApiMock,
    });

    await act(async () => {
      client.emitRawMessage(POLICY_CHAT_TEST_ERROR_DESTINATION, JSON.stringify({ code: 'C001' }));
    });

    expect(result.current.isSending).toBe(false);
    expect(result.current.sendErrorMessage).toBeNull();
  });

  it('resolves send failure when the broker delivery confirmation times out', async () => {
    const { result } = await renderConnectedPolicyChat({
      getClient: latestClient,
      historyMock: policyChatApiMock,
    });
    vi.useFakeTimers();

    let sendResult = Promise.resolve(false);
    await act(async () => {
      sendResult = result.current.sendMessage('hello');
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10_000);
    });

    await expect(sendResult).resolves.toBe(false);
    expect(result.current.isSending).toBe(false);
    expect(result.current.sendErrorMessage).toBe(CHAT_SEND_FALLBACK_MESSAGE);
  });
});
