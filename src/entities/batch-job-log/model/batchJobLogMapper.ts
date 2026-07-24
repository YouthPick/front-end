import type { BatchJobLogDto } from '../api/batchJobLog.dto';
import type { BatchJobLog } from './batchJobLog.types';

export function mapBatchJobLogDtoToBatchJobLog(dto: BatchJobLogDto): BatchJobLog {
  return {
    id: dto.id,
    userId: dto.userId,
    status: dto.status,
    inputPayload: dto.inputPayload,
    executedAt: dto.executedAt,
    createdPolicyCount: dto.createdPolicyCount,
    updatedPolicyCount: dto.updatedPolicyCount,
    disappearedPolicyCount: dto.disappearedPolicyCount,
    failedPolicyCount: dto.failedPolicyCount,
  };
}
