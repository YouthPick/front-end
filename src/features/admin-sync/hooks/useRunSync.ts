import { useRunBatchJobSyncMutation } from '@/entities/batch-job-log';
import { useAuthStore } from '@/entities/user';
import { useToast } from '@/shared/ui';

export function useRunSync() {
  const { showToast } = useToast();
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const mutation = useRunBatchJobSyncMutation();

  const runSync = () => {
    mutation.mutate(userId, {
      onSuccess: () =>
        showToast('공공 API 연동 및 청년정책 정보 수동 동기화가 완료되었습니다!', 'success'),
      onError: () =>
        showToast('수동 동기화에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'warning'),
    });
  };

  return {
    runSync,
    isSyncing: mutation.isPending,
  };
}
