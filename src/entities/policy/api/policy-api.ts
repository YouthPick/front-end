import type { FilterState } from "@features/policy-filter";
import { requestJson, type ApiResponse } from "@shared/api/http";

export interface PolicyCardDto {
  policyId: string;
  title: string;
  summary: string;
  supportContent: string;
  organizationName: string;
  region: string;
  category: string;
  applicationStatus: string;
  updatedAt: string;
}

export interface PolicyDetailDto {
  policyId: string;
  title: string;
  description: string;
  supportContent: string;
  eligibility: string;
  region: string;
  category: string;
  applicationPeriod: string;
  businessPeriod: string;
  applicationMethod: string;
  organizationName: string;
  referenceUrl: string;
  updatedAt: string;
}

export interface PolicyListDto {
  items: PolicyCardDto[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  degraded: boolean;
}

export interface PolicySearchSuggestionDto {
  keyword: string;
}

export interface PolicySearchSuggestionListDto {
  items: PolicySearchSuggestionDto[];
}

export interface PolicySearchQuery {
  keyword: string;
  filters: FilterState;
  page?: number;
  size?: number;
}

export async function fetchPolicies(query: PolicySearchQuery, signal?: AbortSignal): Promise<PolicyListDto> {
  const searchParams = new URLSearchParams();
  if (query.keyword.trim()) {
    searchParams.set("keyword", query.keyword.trim());
  }
  if (query.filters.region !== "전체") {
    searchParams.set("region", query.filters.region);
  }
  if (query.filters.category !== "전체") {
    searchParams.set("category", query.filters.category);
  }
  searchParams.set("page", String(query.page ?? 0));
  searchParams.set("size", String(query.size ?? 20));
  searchParams.set("sort", "relevance");

  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const response = await requestJson<ApiResponse<PolicyListDto>>(`/api/v1/policies${suffix}`, { signal });
  return response.data;
}

export async function fetchPolicyDetail(policyId: string, signal?: AbortSignal): Promise<PolicyDetailDto> {
  const response = await requestJson<ApiResponse<PolicyDetailDto>>(
    `/api/v1/policies/${encodeURIComponent(policyId)}`,
    { signal },
  );
  return response.data;
}

export async function fetchPolicySearchSuggestions(keyword: string, signal?: AbortSignal): Promise<PolicySearchSuggestionListDto> {
  const searchParams = new URLSearchParams();
  if (keyword.trim()) {
    searchParams.set("keyword", keyword.trim());
  }

  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const response = await requestJson<ApiResponse<PolicySearchSuggestionListDto>>(
    `/api/v1/policies/search-suggestions${suffix}`,
    { signal },
  );
  return response.data;
}
