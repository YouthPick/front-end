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

  function clearReceiptTimeout(): void {
    if (timeoutId === null) return;
    clearTimeout(timeoutId);
    timeoutId = null;
  }

  function settleReceipt(): void {
    if (isSettled || !isActive()) return;
    isSettled = true;
    clearReceiptTimeout();
    resolveReceipt?.();
  }

  const confirmed = new Promise<void>((resolve) => {
    resolveReceipt = resolve;
    timeoutId = setTimeout(settleReceipt, timeoutMs);
    client.watchForReceipt(receiptId, settleReceipt);
  });

  return {
    confirmed,
    cancel: () => {
      isSettled = true;
      clearReceiptTimeout();
    },
  };
}
