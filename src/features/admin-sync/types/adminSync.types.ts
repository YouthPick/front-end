export type SyncStatus = "SUCCESS" | "PARTIAL";

export interface SyncLog {
  date: string;
  status: SyncStatus;
  newCount: number;
  editCount: number;
  missingCount: number;
  errorCount: number;
}

export interface SyncSummary {
  activeCount: number;
  missingCount: number;
  parseErrorCount: number;
  dbFailCount: number;
}
