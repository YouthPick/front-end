import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { PageResult } from '@/shared/types';

import {
  type BatchJobLogSearchParams,
  fetchBatchJobLogs,
  runBatchJobSync,
} from '../api/batchJobLogApi';
import type { BatchJobLog } from './batchJobLog.types';
import { mapBatchJobLogDtoToBatchJobLog } from './batchJobLogMapper';

export const batchJobLogKeys = {
  all: ['admin', 'batch-job-logs'] as const,
  list: (params: BatchJobLogSearchParams) => ['admin', 'batch-job-logs', 'list', params] as const,
};

export function useBatchJobLogsQuery(params: BatchJobLogSearchParams) {
  return useQuery({
    queryKey: batchJobLogKeys.list(params),
    queryFn: async (): Promise<PageResult<BatchJobLog>> => {
      const pageDto = await fetchBatchJobLogs(params);
      return { ...pageDto, items: pageDto.items.map(mapBatchJobLogDtoToBatchJobLog) };
    },
    placeholderData: keepPreviousData,
  });
}

export function useRunBatchJobSyncMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string | null) => runBatchJobSync(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchJobLogKeys.all });
    },
  });
}
