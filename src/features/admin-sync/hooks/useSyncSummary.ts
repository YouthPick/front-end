import { useQuery } from '@tanstack/react-query';

import { fetchSyncSummary } from '../api/adminApi';

export const adminSyncKeys = {
  summary: ['admin', 'sync-summary'] as const,
};

export function useSyncSummary() {
  return useQuery({
    queryKey: adminSyncKeys.summary,
    queryFn: fetchSyncSummary,
  });
}
