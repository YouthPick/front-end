import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/shared/ui';

import {
  addChecklistItem,
  deleteChecklistItem,
  deleteTracker,
  editChecklistItem,
  saveTrackerMemo,
  toggleChecklistItem,
  updateTrackerDate,
  updateTrackerStatus,
} from '../api/trackerApi';
import type { TrackerChecklistItem, TrackerStatus } from '../types/tracker.types';
import { trackerKeys } from './useTrackers';

export function useTrackerMutations() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const invalidateTrackers = () => {
    queryClient.invalidateQueries({ queryKey: trackerKeys.all });
  };

  const statusMutation = useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: number; status: TrackerStatus }) =>
      updateTrackerStatus(applicationId, status),
    onSuccess: (_, { status }) => {
      invalidateTrackers();
      showToast(`신청관리 상태가 [${status}]로 갱신되었습니다.`, 'success');
    },
  });

  const dateMutation = useMutation({
    mutationFn: ({ applicationId, targetDate }: { applicationId: number; targetDate: string }) =>
      updateTrackerDate(applicationId, targetDate),
    onSuccess: (_, { targetDate }) => {
      invalidateTrackers();
      showToast(`제출 마감일정이 변경되었습니다: ${targetDate}`, 'info');
    },
  });

  const addChecklistMutation = useMutation({
    mutationFn: ({ applicationId, text }: { applicationId: number; text: string }) =>
      addChecklistItem(applicationId, text),
    onSuccess: () => {
      invalidateTrackers();
      showToast('체크리스트 준비 일감이 추가되었습니다.', 'success');
    },
  });

  const toggleChecklistMutation = useMutation({
    mutationFn: (item: TrackerChecklistItem) => toggleChecklistItem(item),
    onSuccess: invalidateTrackers,
  });

  const editChecklistMutation = useMutation({
    mutationFn: ({ itemId, text }: { itemId: number; text: string }) =>
      editChecklistItem(itemId, text),
    onSuccess: () => {
      invalidateTrackers();
      showToast('체크리스트 내용이 수정되었습니다.', 'success');
    },
    onError: () => {
      showToast('체크리스트 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'warning');
    },
  });

  const deleteChecklistMutation = useMutation({
    mutationFn: (itemId: number) => deleteChecklistItem(itemId),
    onSuccess: () => {
      invalidateTrackers();
      showToast('준비할 일감이 삭제되었습니다.', 'info');
    },
  });

  const memoMutation = useMutation({
    mutationFn: ({ applicationId, memo }: { applicationId: number; memo: string }) =>
      saveTrackerMemo(applicationId, memo),
    onSuccess: () => {
      invalidateTrackers();
      showToast('개인 기록 메모가 저장되었습니다.', 'success');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (applicationId: number) => deleteTracker(applicationId),
    onSuccess: () => {
      invalidateTrackers();
      showToast('신청관리 목록에서 삭제되었습니다.', 'warning');
    },
  });

  return {
    updateStatus: (applicationId: number, status: TrackerStatus) =>
      statusMutation.mutate({ applicationId, status }),
    updateDate: (applicationId: number, targetDate: string) =>
      dateMutation.mutate({ applicationId, targetDate }),
    addChecklistItem: (applicationId: number, text: string) =>
      addChecklistMutation.mutate({ applicationId, text }),
    editChecklistItem: (itemId: number, text: string) =>
      editChecklistMutation.mutate({ itemId, text }),
    toggleChecklistItem: (item: TrackerChecklistItem) => toggleChecklistMutation.mutate(item),
    deleteChecklistItem: (itemId: number) => deleteChecklistMutation.mutate(itemId),
    saveMemo: (applicationId: number, memo: string) => memoMutation.mutate({ applicationId, memo }),
    deleteTracker: (applicationId: number, options?: { onSuccess?: () => void }) =>
      deleteMutation.mutate(applicationId, { onSuccess: options?.onSuccess }),
  };
}
