import type { BatchJobLogStatus } from '../api/batchJobLog.dto';

export interface BatchJobLog {
  id: string;
  userId: string | null;
  status: BatchJobLogStatus;
  inputPayload: string;
  executedAt: string;
  createdPolicyCount: number;
  updatedPolicyCount: number;
  disappearedPolicyCount: number;
  failedPolicyCount: number;
}
