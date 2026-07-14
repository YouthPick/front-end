import type { BatchJobLogDto, BatchJobLogStatus } from './batchJobLog.dto';

const STATUS_CYCLE: BatchJobLogStatus[] = ['SUCCESS', 'SUCCESS', 'PARTIAL', 'SUCCESS', 'FAILED'];
const MOCK_BATCH_JOB_LOG_COUNT = 16;
const DAY_MS = 24 * 60 * 60 * 1000;

function buildMockBatchJobLogs(): BatchJobLogDto[] {
  return Array.from({ length: MOCK_BATCH_JOB_LOG_COUNT }, (_, index) => {
    const status = STATUS_CYCLE[index % STATUS_CYCLE.length];
    const isFailed = status === 'FAILED';

    return {
      id: `batch-job-${index + 1}`,
      userId: null,
      status,
      inputPayload: '{"source":"공공데이터포털","dataset":"청년정책목록"}',
      executedAt: new Date(Date.now() - index * DAY_MS).toISOString(),
      createdPolicyCount: isFailed ? 0 : Math.floor(Math.random() * 20) + 5,
      updatedPolicyCount: isFailed ? 0 : Math.floor(Math.random() * 40) + 10,
      disappearedPolicyCount: isFailed ? 0 : Math.floor(Math.random() * 5),
      failedPolicyCount:
        status === 'PARTIAL' ? Math.floor(Math.random() * 3) + 1 : isFailed ? 1 : 0,
    };
  });
}

export const MOCK_BATCH_JOB_LOG_DTOS: BatchJobLogDto[] = buildMockBatchJobLogs();
