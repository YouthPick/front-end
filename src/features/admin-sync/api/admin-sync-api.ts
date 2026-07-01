import { getUserHeaders, getUserJsonHeaders } from "@entities/user";
import { requestJson, type ApiResponse } from "@shared/api/http";

export type PolicySyncJobModeDto = "FULL" | "DELTA";
export type PolicySyncJobStatusDto = "REQUESTED" | "RUNNING" | "SUCCEEDED" | "FAILED";

export interface PolicySyncJobDto {
  jobId: number;
  mode: PolicySyncJobModeDto;
  status: PolicySyncJobStatusDto;
  newCount: number;
  updatedCount: number;
  unchangedCount: number;
  missingCount: number;
  errorCount: number;
  startedAt: string | null;
  finishedAt: string | null;
  failureMessage: string | null;
}

export interface PolicySyncJobListDto {
  items: PolicySyncJobDto[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface SearchIndexRebuildDto {
  indexJobId: string;
  status: "REQUESTED" | "RUNNING" | "SUCCEEDED" | "FAILED";
  requestedAt: string;
  message: string;
}

export async function fetchPolicySyncJobs(signal?: AbortSignal): Promise<PolicySyncJobListDto> {
  const response = await requestJson<ApiResponse<PolicySyncJobListDto>>(
    "/api/v1/admin/policy-sync-jobs?page=0&size=20",
    { headers: getUserHeaders(), signal },
  );
  return response.data;
}

export async function startPolicySync(mode: PolicySyncJobModeDto = "FULL"): Promise<PolicySyncJobDto> {
  const response = await requestJson<ApiResponse<PolicySyncJobDto>>("/api/v1/admin/policy-sync-jobs", {
    method: "POST",
    headers: getUserJsonHeaders(),
    body: JSON.stringify({ mode }),
  });
  return response.data;
}

export async function rebuildSearchIndex(): Promise<SearchIndexRebuildDto> {
  const response = await requestJson<ApiResponse<SearchIndexRebuildDto>>("/api/v1/admin/search-indexes/rebuild", {
    method: "POST",
    headers: getUserHeaders(),
  });
  return response.data;
}
