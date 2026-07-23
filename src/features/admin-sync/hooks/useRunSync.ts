import { useRunBatchJobSyncMutation } from '@/entities/batch-job-log';
import { useToast } from '@/shared/ui';

export function useRunSync() {
  const { showToast } = useToast();
  const mutation = useRunBatchJobSyncMutation();

  const runSync = () => {
    mutation.mutate(undefined, {
      onSuccess: () =>
        showToast('동기화 요청을 시작했습니다. 결과는 배치 작업 로그에서 확인하세요.', 'success'),
      onError: () =>
        showToast('수동 동기화 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'warning'),
    });
  };

  return {
    runSync,
    isSyncing: mutation.isPending,
  };
}
