import { requestJson, type ApiResponse } from "@shared/api/http";

export interface PolicyComparisonPolicyDto {
  policyId: string;
  title: string;
  region: string;
  category: string;
  applicationStatus: string;
  organizationName: string;
  referenceUrl: string;
}

export interface PolicyComparisonValueDto {
  policyId: string;
  displayValue: string;
  missing: boolean;
}

export interface PolicyComparisonRowDto {
  key: string;
  label: string;
  different: boolean;
  values: PolicyComparisonValueDto[];
}

export interface PolicyComparisonDto {
  comparisonId: string;
  policies: PolicyComparisonPolicyDto[];
  rows: PolicyComparisonRowDto[];
  notice: string;
}

export async function createPolicyComparison(policyIds: string[]): Promise<PolicyComparisonDto> {
  const response = await requestJson<ApiResponse<PolicyComparisonDto>>("/api/v1/policy-comparisons", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ policyIds }),
  });
  return response.data;
}

export async function fetchPolicyComparison(comparisonId: string): Promise<PolicyComparisonDto> {
  const response = await requestJson<ApiResponse<PolicyComparisonDto>>(
    `/api/v1/policy-comparisons/${encodeURIComponent(comparisonId)}`
  );
  return response.data;
}
