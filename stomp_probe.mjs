import { readFileSync } from 'node:fs';
import { Client } from '@stomp/stompjs';

const token = readFileSync('/tmp/test_access_token.txt', 'utf8').trim();
const policyId = 1;
const startedAt = Date.now();

function log(label) {
  console.log(`[+${((Date.now() - startedAt) / 1000).toFixed(2)}s] ${label}`);
}

const client = new Client({
  brokerURL: 'ws://localhost:8081/api/ws',
  reconnectDelay: 0, // don't auto-reconnect; we want to see the raw first-connection behavior
  heartbeatIncoming: 10_000,
  heartbeatOutgoing: 10_000,
  connectionTimeout: 10_000,
  connectHeaders: { Authorization: `Bearer ${token}` },
  debug: (msg) => {
    if (/^>>>|^<<</.test(msg) || /RECEIPT|ERROR|CONNECTED/.test(msg)) {
      log(`STOMP: ${msg}`);
    }
  },
  onConnect: () => {
    log('onConnect fired');
    const receiptId = 'probe-receipt-1';
    client.watchForReceipt(receiptId, () => log('RECEIPT received for subscribe'));
    client.subscribe(
      `/user/queue/policies/${policyId}/chat/messages`,
      (msg) => log(`message received: ${msg.body}`),
      { receipt: receiptId },
    );
    setTimeout(() => {
      log(
        `12s mark reached without process exit — checking if still connected: ${client.connected}`,
      );
    }, 12_000);
  },
  onDisconnect: () => log('onDisconnect fired'),
  onWebSocketClose: (evt) => log(`onWebSocketClose fired code=${evt.code} reason=${evt.reason}`),
  onWebSocketError: (_evt) => log(`onWebSocketError fired`),
  onStompError: (frame) => log(`onStompError fired: ${frame.body}`),
});

client.activate();

setTimeout(() => {
  log('20s watchdog reached, exiting');
  process.exit(0);
}, 20_000);
