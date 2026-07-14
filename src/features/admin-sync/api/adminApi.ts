import { MOCK_API_DELAY_MS } from '@/shared/constants';
import { delay } from '@/shared/utils';

import type { SyncSummary } from '../types/adminSync.types';

// 백엔드 API가 준비되면 이 파일의 mock 구현만 apiClient 호출로 교체한다.

const MOCK_SYNC_SUMMARY: SyncSummary = {
  activeCount: 3241,
  missingCount: 12,
  parseErrorCount: 18,
  dbFailCount: 2,
};

export async function fetchSyncSummary(): Promise<SyncSummary> {
  await delay(MOCK_API_DELAY_MS);
  return { ...MOCK_SYNC_SUMMARY };
}
