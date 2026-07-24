import { apiClient } from '@/shared/api';

import type { SyncSummary } from '../types/adminSync.types';

export async function fetchSyncSummary(): Promise<SyncSummary> {
  const response = await apiClient.get<{ data: SyncSummary }>('/v1/admin/policy-sync-jobs/summary');
  return response.data.data;
}
