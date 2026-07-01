import { requestJson, type ApiResponse } from "@shared/api/http";
import { getUserHeaders } from "./auth-api";

export type PolicyReadStatus = "UNREAD" | "READ" | "NEEDS_RECHECK";

export interface PolicyReadStateDto {
  policyId: string;
  status: PolicyReadStatus;
  firstReadAt: string | null;
  lastReadAt: string | null;
  readPolicyUpdatedAt: string | null;
}

export interface PolicyReadStateListDto {
  items: PolicyReadStateDto[];
}

export async function fetchPolicyReadStates(policyIds: string[], signal?: AbortSignal): Promise<PolicyReadStateListDto> {
  const searchParams = new URLSearchParams();
  policyIds.forEach((policyId) => searchParams.append("policyIds", policyId));
  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const response = await requestJson<ApiResponse<PolicyReadStateListDto>>(`/api/v1/me/policy-read-states${suffix}`, {
    headers: getUserHeaders(),
    signal,
  });
  return response.data;
}

export async function markPolicyAsRead(policyId: string): Promise<PolicyReadStateDto> {
  const response = await requestJson<ApiResponse<PolicyReadStateDto>>(
    `/api/v1/me/policy-read-states/${encodeURIComponent(policyId)}`,
    { method: "PUT", headers: getUserHeaders() },
  );
  return response.data;
}
