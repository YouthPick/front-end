import { useQuery } from "@tanstack/react-query";

import { fetchSyncHistory } from "../api/adminApi";

export const adminSyncKeys = {
  history: ["admin", "sync-history"] as const,
};

export function useSyncHistory() {
  return useQuery({
    queryKey: adminSyncKeys.history,
    queryFn: fetchSyncHistory,
  });
}
