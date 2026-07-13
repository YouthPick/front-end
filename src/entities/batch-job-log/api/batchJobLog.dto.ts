export type BatchJobLogStatus = 'SUCCESS' | 'PARTIAL' | 'FAILED';

export interface BatchJobLogDto {
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
