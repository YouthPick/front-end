import { getUserHeaders } from "@entities/user";
import { requestJson, type ApiResponse } from "@shared/api/http";

export interface AdminMetricsDto {
  policy: {
    totalCount: number;
    exposedCount: number;
    activeCount: number;
    missingReferenceUrlCount: number;
  };
  user: {
    profileCount: number;
    favoriteCount: number;
    readStateCount: number;
  };
  sync: {
    totalJobCount: number;
    succeededJobCount: number;
    failedJobCount: number;
    runningJobCount: number;
    lastJobStatus?: string | null;
    lastJobErrorCount: number;
  };
  generatedAt: string;
}

export async function fetchAdminMetrics(signal?: AbortSignal): Promise<AdminMetricsDto> {
  const response = await requestJson<ApiResponse<AdminMetricsDto>>("/api/v1/admin/metrics", {
    headers: getUserHeaders(),
    signal,
  });
  return response.data;
}
