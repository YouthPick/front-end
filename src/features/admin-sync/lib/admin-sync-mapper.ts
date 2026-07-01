import type { PolicySyncJobDto } from "../api/admin-sync-api";
import type { AdminSyncLog } from "../model/types";

function formatDate(value: string | null): string {
  if (!value) return "시간 미정";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function mapPolicySyncJobDto(dto: PolicySyncJobDto): AdminSyncLog {
  return {
    id: `job-${dto.jobId}`,
    date: formatDate(dto.finishedAt ?? dto.startedAt),
    status: dto.status,
    newCount: dto.newCount,
    editCount: dto.updatedCount,
    unchangedCount: dto.unchangedCount,
    missingCount: dto.missingCount,
    errorCount: dto.errorCount,
    failureMessage: dto.failureMessage,
  };
}
