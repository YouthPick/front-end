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

// 관리자 대시보드의 "수동 강제 동기화" 버튼이 호출한다. 비동기로 전체 동기화를 시작시키고 202를
// 반환할 뿐 결과 로그는 안 준다 — 결과는 배치 작업 로그 목록(useBatchJobLogsQuery)에서 확인한다.
export async function runBatchJobSync(): Promise<void> {
  await apiClient.post('/v1/admin/batch/policy-sync');
}
