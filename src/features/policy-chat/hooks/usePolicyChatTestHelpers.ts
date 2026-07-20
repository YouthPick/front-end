import { act, renderHook, waitFor } from '@testing-library/react';
import { expect, vi } from 'vitest';

import type { PolicyChatMessageDto } from '../api/policyChat.dto';
import { usePolicyChat } from './usePolicyChat';

export const POLICY_CHAT_TEST_POLICY_ID = 42;
export const POLICY_CHAT_TEST_MESSAGE_DESTINATION = `/user/queue/policies/${POLICY_CHAT_TEST_POLICY_ID}/chat/messages`;
export const POLICY_CHAT_TEST_ERROR_DESTINATION = `/user/queue/policies/${POLICY_CHAT_TEST_POLICY_ID}/chat/errors`;
export const POLICY_CHAT_TEST_VALIDATION_ERROR_MESSAGE =
  '메시지는 1자 이상 1000자 이하로 입력해 주세요.';

interface MockFrame {
  readonly body: string;
  readonly headers: Record<string, string>;
}

interface MockSubscribeCall {
  readonly destination: string;
  readonly callback: (message: MockFrame) => void;
  readonly headers: Record<string, string> | undefined;
  readonly unsubscribe: ReturnType<typeof vi.fn>;
}

export interface MockPublishParams {
  readonly destination: string;
  readonly headers?: Record<string, string>;
  readonly body: string;
}

export interface MockClientConfig {
  readonly beforeConnect?: () => void | Promise<void>;
  readonly onConnect?: () => void;
  readonly onStompError?: (frame: MockFrame) => void;
  readonly onWebSocketClose?: () => void;
  readonly onWebSocketError?: () => void;
}

export class MockStompClient {
  readonly config: MockClientConfig;
  readonly subscriptions: MockSubscribeCall[] = [];
  readonly published: MockPublishParams[] = [];
  readonly receiptWatchers = new Map<string, (frame: MockFrame) => void>();
  readonly deactivate = vi.fn(() => Promise.resolve());
  readonly publish = vi.fn((params: MockPublishParams) => {
    this.published.push(params);
  });
  connected = false;
  connectHeaders: Record<string, string> = {};
  private beforeConnectPromise: Promise<void> = Promise.resolve();

  constructor(config: MockClientConfig) {
    this.config = config;
  }

  activate(): void {
    this.beforeConnectPromise = Promise.resolve(this.config.beforeConnect?.()).then(
      () => undefined,
    );
  }

  async finishBeforeConnect(): Promise<void> {
    await this.beforeConnectPromise;
  }

  connect(): void {
    this.connected = true;
    this.config.onConnect?.();
  }

  emitStompError(body: string): void {
    this.config.onStompError?.({ body, headers: {} });
  }

  emitWebSocketClose(): void {
    this.config.onWebSocketClose?.();
  }

  emitWebSocketError(): void {
    this.config.onWebSocketError?.();
  }

  subscribe(
    destination: string,
    callback: (message: MockFrame) => void,
    headers?: Record<string, string>,
  ): { unsubscribe: ReturnType<typeof vi.fn> } {
    const subscription = { destination, callback, headers, unsubscribe: vi.fn() };
    this.subscriptions.push(subscription);
    return { unsubscribe: subscription.unsubscribe };
  }

  watchForReceipt(receiptId: string, callback: (frame: MockFrame) => void): void {
    this.receiptWatchers.set(receiptId, callback);
  }

  emitReceipt(receiptId: string): void {
    this.receiptWatchers.get(receiptId)?.({ body: '', headers: { 'receipt-id': receiptId } });
  }

  emitMessage(destination: string, dto: PolicyChatMessageDto): void {
    const subscription = this.subscriptions.find((entry) => entry.destination === destination);
    subscription?.callback({ body: JSON.stringify(dto), headers: {} });
  }

  emitRawMessage(destination: string, body: string): void {
    const subscription = this.subscriptions.find((entry) => entry.destination === destination);
    subscription?.callback({ body, headers: {} });
  }
}

interface ReceiptSubscription {
  readonly headers: Record<string, string> | undefined;
}

interface ConnectedPolicyChatClient {
  readonly subscriptions: readonly ReceiptSubscription[];
  finishBeforeConnect: () => Promise<void>;
  connect: () => void;
  emitReceipt: (receiptId: string) => void;
}

interface PolicyChatAuthClient {
  finishBeforeConnect: () => Promise<void>;
}

interface PolicyChatHistoryMock {
  readonly fetchPolicyChatMessages: ReturnType<typeof import('vitest').vi.fn>;
}

interface RenderConnectedPolicyChatParams<Client extends ConnectedPolicyChatClient> {
  readonly getClient: () => Client;
  readonly historyMock: PolicyChatHistoryMock;
}

export function makePolicyChatTestJwt(expiresInSeconds: number): string {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + expiresInSeconds }));
  return `${header}.${payload}.signature`;
}

export function makePolicyChatMessageDto(id: number, content: string): PolicyChatMessageDto {
  return {
    id,
    policyId: POLICY_CHAT_TEST_POLICY_ID,
    authorName: '나',
    content,
    createdAt: `2026-01-01T00:00:${id.toString().padStart(2, '0')}.000Z`,
    mine: true,
  };
}

export function getPolicyChatReceiptIds(client: MockStompClient): readonly [string, string] {
  const [messageSubscription, errorSubscription] = client.subscriptions;
  const messageReceiptId = messageSubscription?.headers?.receipt;
  const errorReceiptId = errorSubscription?.headers?.receipt;

  if (!messageReceiptId || !errorReceiptId) {
    throw new Error('Expected message and error subscriptions to include receipt headers');
  }

  return [messageReceiptId, errorReceiptId];
}

export function renderPolicyChatTestHook() {
  return renderHook(() => usePolicyChat({ policyId: POLICY_CHAT_TEST_POLICY_ID, enabled: true }));
}

export async function finishPolicyChatBeforeConnect(client: PolicyChatAuthClient): Promise<void> {
  await act(async () => {
    await client.finishBeforeConnect();
  });
}

export async function renderConnectedPolicyChat<Client extends ConnectedPolicyChatClient>({
  getClient,
  historyMock,
}: RenderConnectedPolicyChatParams<Client>) {
  const hook = renderPolicyChatTestHook();
  const client = getClient();

  await act(async () => {
    await client.finishBeforeConnect();
    client.connect();
  });
  await waitFor(() => expect(historyMock.fetchPolicyChatMessages).toHaveBeenCalledTimes(1));

  const [messageSubscription, errorSubscription] = client.subscriptions;
  if (!messageSubscription?.headers?.receipt || !errorSubscription?.headers?.receipt) {
    throw new Error('Expected subscriptions to include receipt headers');
  }

  await act(async () => {
    client.emitReceipt(messageSubscription.headers.receipt);
    client.emitReceipt(errorSubscription.headers.receipt);
  });
  await waitFor(() => expect(historyMock.fetchPolicyChatMessages).toHaveBeenCalledTimes(2));

  return { client, result: hook.result };
}
