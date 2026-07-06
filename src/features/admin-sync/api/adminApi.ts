import { delay } from "@/shared/utils";

import type { SyncLog } from "../types/adminSync.types";

// 백엔드 API가 준비되면 이 파일의 mock 구현만 apiClient 호출로 교체한다.
const MOCK_FETCH_DELAY_MS = 150;
const MOCK_SYNC_DURATION_MS = 2000;

let syncHistory: SyncLog[] = [
  { date: "06.24 06:00", status: "SUCCESS", newCount: 18, editCount: 44, missingCount: 2, errorCount: 0 },
  { date: "06.23 06:00", status: "PARTIAL", newCount: 12, editCount: 31, missingCount: 4, errorCount: 2 },
];

export async function fetchSyncHistory(): Promise<SyncLog[]> {
  await delay(MOCK_FETCH_DELAY_MS);
  return syncHistory.map((log) => ({ ...log }));
}

export async function runSync(): Promise<SyncLog> {
  await delay(MOCK_SYNC_DURATION_MS);
  const newLog: SyncLog = {
    date: "오늘 " + new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    status: "SUCCESS",
    newCount: Math.floor(Math.random() * 20) + 5,
    editCount: Math.floor(Math.random() * 30) + 10,
    missingCount: Math.floor(Math.random() * 3),
    errorCount: 0,
  };
  syncHistory = [newLog, ...syncHistory];
  return { ...newLog };
}
