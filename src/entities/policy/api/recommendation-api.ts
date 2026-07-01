import { requestJson, type ApiResponse } from "@shared/api/http";
import type { PolicyCardDto } from "./policy-api";
import { getUserHeaders } from "@entities/user";

export type RecommendationConfidence = "HIGH" | "MEDIUM" | "LOW";

export interface RecommendationReasonDto {
  code: string;
  message: string;
  score: number;
}

export interface RecommendedPolicyDto {
  policy: PolicyCardDto;
  score: number;
  confidence: RecommendationConfidence;
  reasons: RecommendationReasonDto[];
  checkpoints: string[];
}

export interface RecommendedPolicyListDto {
  items: RecommendedPolicyDto[];
  personalized: boolean;
  message: string;
}

export interface RecommendedPolicyQuery {
  region?: string;
  category?: string;
  keyword?: string;
}

export async function fetchRecommendedPolicies(
  query: RecommendedPolicyQuery,
  signal?: AbortSignal,
): Promise<RecommendedPolicyListDto> {
  const searchParams = new URLSearchParams();
  if (query.region?.trim()) {
    searchParams.set("region", query.region.trim());
  }
  if (query.category?.trim()) {
    searchParams.set("category", query.category.trim());
  }
  if (query.keyword?.trim()) {
    searchParams.set("keyword", query.keyword.trim());
  }

  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const response = await requestJson<ApiResponse<RecommendedPolicyListDto>>(
    `/api/v1/me/recommended-policies${suffix}`,
    {
      headers: getUserHeaders(),
      signal,
    },
  );
  return response.data;
}
