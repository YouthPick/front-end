import { type ApiPageEnvelope, apiClient, toPageResult } from '@/shared/api';
import type { PageParams, PageResult } from '@/shared/types';

import type { BatchJobLogDto, BatchJobLogStatus } from './batchJobLog.dto';

export interface BatchJobLogSearchParams extends PageParams {
  status?: BatchJobLogStatus;
  // "YYYY-MM-DD"(KST 기준). 실행 시각(executedAt)이 이 범위 안에 있는 로그만 조회한다.
  startDate?: string;
  endDate?: string;
}

export async function fetchBatchJobLogs(
  params: BatchJobLogSearchParams,
): Promise<PageResult<BatchJobLogDto>> {
  const response = await apiClient.get<ApiPageEnvelope<BatchJobLogDto>>(
    '/v1/admin/batch-job-logs',
    { params },
  );
  return toPageResult(response.data, params.pageSize);
}

// 관리자 대시보드의 "수동 강제 동기화" 버튼이 호출한다. 새 배치 작업을 실행하고 결과 로그 한 건을 반환한다.
export async function runBatchJobSync(userId: string | null): Promise<BatchJobLogDto> {
  const response = await apiClient.post<{ data: BatchJobLogDto }>('/v1/admin/batch-job-logs', {
    userId,
  });
  return response.data.data;
}
