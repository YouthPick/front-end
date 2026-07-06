import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/shared/ui";

import {
  addChecklistItem,
  deleteChecklistItem,
  deleteTracker,
  saveTrackerMemo,
  toggleChecklistItem,
  updateTrackerDate,
  updateTrackerStatus,
} from "../api/trackerApi";
import type { TrackerStatus } from "../types/tracker.types";
import { trackerKeys } from "./useTrackers";

export function useTrackerMutations() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const invalidateTrackers = () => {
    queryClient.invalidateQueries({ queryKey: trackerKeys.all });
  };

  const statusMutation = useMutation({
    mutationFn: ({ policyId, status }: { policyId: string; status: TrackerStatus }) =>
      updateTrackerStatus(policyId, status),
    onSuccess: (_, { status }) => {
      invalidateTrackers();
      showToast(`신청관리 상태가 [${status}]로 갱신되었습니다.`, "success");
    },
  });

  const dateMutation = useMutation({
    mutationFn: ({ policyId, targetDate }: { policyId: string; targetDate: string }) =>
      updateTrackerDate(policyId, targetDate),
    onSuccess: (_, { targetDate }) => {
      invalidateTrackers();
      showToast(`제출 마감일정이 변경되었습니다: ${targetDate}`, "info");
    },
  });

  const addChecklistMutation = useMutation({
    mutationFn: ({ policyId, text }: { policyId: string; text: string }) =>
      addChecklistItem(policyId, text),
    onSuccess: () => {
      invalidateTrackers();
      showToast("체크리스트 준비 일감이 추가되었습니다.", "success");
    },
  });

  const toggleChecklistMutation = useMutation({
    mutationFn: ({ policyId, itemId }: { policyId: string; itemId: string }) =>
      toggleChecklistItem(policyId, itemId),
    onSuccess: invalidateTrackers,
  });

  const deleteChecklistMutation = useMutation({
    mutationFn: ({ policyId, itemId }: { policyId: string; itemId: string }) =>
      deleteChecklistItem(policyId, itemId),
    onSuccess: () => {
      invalidateTrackers();
      showToast("준비할 일감이 삭제되었습니다.", "info");
    },
  });

  const memoMutation = useMutation({
    mutationFn: ({ policyId, memo }: { policyId: string; memo: string }) =>
      saveTrackerMemo(policyId, memo),
    onSuccess: () => {
      invalidateTrackers();
      showToast("📝 개인 기록 메모가 성공적으로 저장되었습니다.", "success");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (policyId: string) => deleteTracker(policyId),
    onSuccess: () => {
      invalidateTrackers();
      showToast("신청관리 목록에서 안전하게 삭제되었습니다.", "warning");
    },
  });

  return {
    updateStatus: (policyId: string, status: TrackerStatus) =>
      statusMutation.mutate({ policyId, status }),
    updateDate: (policyId: string, targetDate: string) =>
      dateMutation.mutate({ policyId, targetDate }),
    addChecklistItem: (policyId: string, text: string) =>
      addChecklistMutation.mutate({ policyId, text }),
    toggleChecklistItem: (policyId: string, itemId: string) =>
      toggleChecklistMutation.mutate({ policyId, itemId }),
    deleteChecklistItem: (policyId: string, itemId: string) =>
      deleteChecklistMutation.mutate({ policyId, itemId }),
    saveMemo: (policyId: string, memo: string) => memoMutation.mutate({ policyId, memo }),
    deleteTracker: (policyId: string, options?: { onSuccess?: () => void }) =>
      deleteMutation.mutate(policyId, { onSuccess: options?.onSuccess }),
  };
}
