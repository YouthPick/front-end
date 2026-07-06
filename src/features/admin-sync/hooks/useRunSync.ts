import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/shared/ui";

import { runSync } from "../api/adminApi";
import { adminSyncKeys } from "./useSyncHistory";

export function useRunSync() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: runSync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminSyncKeys.history });
      showToast("공공 API 연동 및 청년정책 정보 수동 동기화가 완료되었습니다!", "success");
    },
  });

  return {
    runSync: () => mutation.mutate(),
    isSyncing: mutation.isPending,
  };
}
