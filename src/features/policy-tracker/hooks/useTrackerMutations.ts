import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

import { type ToastType, useToast } from '@/shared/ui';

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

interface TrackerMutationOptions<TVariables, TResult> {
  successToast?: (variables: TVariables, result: TResult) => string;
  successToastType?: ToastType;
  errorToast?: string;
}

// 신청관리 mutation들은 전부 "성공 시 목록 무효화 + 토스트 안내"라는 같은 모양을 반복한다.
// 이 훅이 그 공통 뼈대를 맡고, 각 mutation은 요청 함수와 토스트 문구만 넘긴다.
function useTrackerMutation<TVariables, TResult>(
  mutationFn: (variables: TVariables) => Promise<TResult>,
  options?: TrackerMutationOptions<TVariables, TResult>,
): UseMutationResult<TResult, unknown, TVariables> {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn,
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: trackerKeys.all });
      if (options?.successToast) {
        showToast(options.successToast(variables, result), options.successToastType);
      }
    },
    onError: options?.errorToast
      ? () => showToast(options.errorToast as string, 'warning')
      : undefined,
  });
}

export function useTrackerMutations() {
  const statusMutation = useTrackerMutation(
    ({ applicationId, status }: { applicationId: number; status: TrackerStatus }) =>
      updateTrackerStatus(applicationId, status),
    { successToast: ({ status }) => `신청관리 상태가 [${status}]로 갱신되었습니다.` },
  );

  const dateMutation = useTrackerMutation(
    ({ applicationId, targetDate }: { applicationId: number; targetDate: string }) =>
      updateTrackerDate(applicationId, targetDate),
    {
      successToast: ({ targetDate }) => `제출 마감일정이 변경되었습니다: ${targetDate}`,
      successToastType: 'info',
    },
  );

  const addChecklistMutation = useTrackerMutation(
    ({ applicationId, text }: { applicationId: number; text: string }) =>
      addChecklistItem(applicationId, text),
    { successToast: () => '체크리스트 준비 일감이 추가되었습니다.' },
  );

  const toggleChecklistMutation = useTrackerMutation((item: TrackerChecklistItem) =>
    toggleChecklistItem(item),
  );

  const editChecklistMutation = useTrackerMutation(
    ({ itemId, text }: { itemId: number; text: string }) => editChecklistItem(itemId, text),
    {
      successToast: () => '체크리스트 내용이 수정되었습니다.',
      errorToast: '체크리스트 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.',
    },
  );

  const deleteChecklistMutation = useTrackerMutation(
    (itemId: number) => deleteChecklistItem(itemId),
    { successToast: () => '준비할 일감이 삭제되었습니다.', successToastType: 'info' },
  );

  const memoMutation = useTrackerMutation(
    ({ applicationId, memo }: { applicationId: number; memo: string }) =>
      saveTrackerMemo(applicationId, memo),
    { successToast: () => '개인 기록 메모가 저장되었습니다.' },
  );

  const deleteMutation = useTrackerMutation(
    (applicationId: number) => deleteTracker(applicationId),
    {
      successToast: () => '신청관리 목록에서 삭제되었습니다.',
      successToastType: 'warning',
    },
  );

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
