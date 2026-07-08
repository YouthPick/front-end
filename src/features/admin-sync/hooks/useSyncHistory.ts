import { useQuery } from "@tanstack/react-query";

import { fetchSyncHistory, fetchSyncSummary } from "../api/adminApi";

export const adminSyncKeys = {
  history: ["admin", "sync-history"] as const,
  summary: ["admin", "sync-summary"] as const,
};

export function useSyncHistory() {
  return useQuery({
    queryKey: adminSyncKeys.history,
    queryFn: fetchSyncHistory,
  });
}

export function useSyncSummary() {
  return useQuery({
    queryKey: adminSyncKeys.summary,
    queryFn: fetchSyncSummary,
  });
}
