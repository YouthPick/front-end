import type { Client } from '@stomp/stompjs';

let receiptSequence = 0;

interface PolicyChatReceiptWaiter {
  readonly confirmed: Promise<void>;
  cancel: () => void;
}

export function createPolicyChatReceiptId(policyId: number, purpose: string): string {
  receiptSequence += 1;
  return `policy-chat-${policyId}-${purpose}-${receiptSequence}`;
}

export function waitForPolicyChatReceipt(
  client: Client,
  receiptId: string,
  isActive: () => boolean,
  timeoutMs: number,
): PolicyChatReceiptWaiter {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let isSettled = false;
  let resolveReceipt: (() => void) | null = null;
  let rejectReceipt: (() => void) | null = null;

  function clearReceiptTimeout(): void {
    if (timeoutId === null) return;
    clearTimeout(timeoutId);
    timeoutId = null;
  }

  // 실제 RECEIPT 프레임 수신(성공)과 타임아웃(실패)을 구분해 confirmed의 resolve/reject로 갈라 보낸다.
  function settleReceipt(isConfirmed: boolean): void {
    if (isSettled || !isActive()) return;
    isSettled = true;
    clearReceiptTimeout();
    if (isConfirmed) {
      resolveReceipt?.();
    } else {
      rejectReceipt?.();
    }
  }

  const confirmed = new Promise<void>((resolve, reject) => {
    resolveReceipt = resolve;
    rejectReceipt = reject;
    timeoutId = setTimeout(() => settleReceipt(false), timeoutMs);
    client.watchForReceipt(receiptId, () => settleReceipt(true));
  });

  return {
    confirmed,
    cancel: () => {
      isSettled = true;
      clearReceiptTimeout();
    },
  };
}
