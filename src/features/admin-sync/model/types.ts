export type AdminSyncStatus =
  | "REQUESTED"
  | "RUNNING"
  | "SUCCEEDED"
  | "FAILED"
  | "SUCCESS"
  | "PARTIAL";

export interface AdminSyncLog {
  id: string;
  date: string;
  status: AdminSyncStatus;
  newCount: number;
  editCount: number;
  unchangedCount: number;
  missingCount: number;
  errorCount: number;
  failureMessage?: string | null;
}
