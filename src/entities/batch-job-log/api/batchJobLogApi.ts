import { MOCK_API_DELAY_MS } from '@/shared/constants';
import type { PageParams, PageResult } from '@/shared/types';
import { delay, generateId, paginate } from '@/shared/utils';

import type { BatchJobLogDto, BatchJobLogStatus } from './batchJobLog.dto';
import { MOCK_BATCH_JOB_LOG_DTOS } from './batchJobLogMockData';

// 백엔드 API가 준비되면 이 파일의 mock 구현만 apiClient 호출로 교체한다.
const MOCK_SYNC_DURATION_MS = 2000;

let batchJobLogs: BatchJobLogDto[] = MOCK_BATCH_JOB_LOG_DTOS.map((dto) => ({ ...dto }));

export interface BatchJobLogSearchParams extends PageParams {
  status?: BatchJobLogStatus;
  // "YYYY-MM-DD"(KST 기준). 실행 시각(executedAt)이 이 범위 안에 있는 로그만 조회한다.
  startDate?: string;
  endDate?: string;
}

function matchesBatchJobLogParams(log: BatchJobLogDto, params: BatchJobLogSearchParams): boolean {
  if (params.status && log.status !== params.status) return false;

  const executedAt = new Date(log.executedAt).getTime();
  if (params.startDate && executedAt < new Date(`${params.startDate}T00:00:00+09:00`).getTime()) {
    return false;
  }
  if (params.endDate && executedAt > new Date(`${params.endDate}T23:59:59.999+09:00`).getTime()) {
    return false;
  }

  return true;
}

export async function fetchBatchJobLogs(
  params: BatchJobLogSearchParams,
): Promise<PageResult<BatchJobLogDto>> {
  await delay(MOCK_API_DELAY_MS);

  const filtered = batchJobLogs.filter((log) => matchesBatchJobLogParams(log, params));
  const paged = paginate(filtered, params.page, params.pageSize);

  return { ...paged, items: paged.items.map((dto) => ({ ...dto })) };
}

// 관리자 대시보드의 "수동 강제 동기화" 버튼이 호출한다. 새 배치 작업 로그 한 건을 생성해 이력에 추가한다.
export async function runBatchJobSync(userId: string | null): Promise<BatchJobLogDto> {
  await delay(MOCK_SYNC_DURATION_MS);

  const newLog: BatchJobLogDto = {
    id: generateId(),
    userId,
    status: 'SUCCESS',
    inputPayload: '{"source":"공공데이터포털","dataset":"청년정책목록","trigger":"manual"}',
    executedAt: new Date().toISOString(),
    createdPolicyCount: Math.floor(Math.random() * 20) + 5,
    updatedPolicyCount: Math.floor(Math.random() * 30) + 10,
    disappearedPolicyCount: Math.floor(Math.random() * 3),
    failedPolicyCount: 0,
  };
  batchJobLogs = [newLog, ...batchJobLogs];
  return { ...newLog };
}
