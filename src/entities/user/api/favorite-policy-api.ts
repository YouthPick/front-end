import { requestJson, requestNoContent, type ApiResponse } from "@shared/api/http";
import { getUserHeaders } from "./auth-api";

export interface FavoritePolicyDto {
  policyId: string;
  title: string;
  region: string;
  category: string;
  applicationStatus: string;
}

export interface FavoritePolicyListDto {
  items: FavoritePolicyDto[];
}

export interface FavoritePolicyStatusDto {
  policyId: string;
  saved: boolean;
}

export async function fetchFavoritePolicies(signal?: AbortSignal): Promise<FavoritePolicyListDto> {
  const response = await requestJson<ApiResponse<FavoritePolicyListDto>>("/api/v1/me/favorites", {
    headers: getUserHeaders(),
    signal,
  });
  return response.data;
}

export async function saveFavoritePolicy(policyId: string): Promise<FavoritePolicyStatusDto> {
  const response = await requestJson<ApiResponse<FavoritePolicyStatusDto>>(
    `/api/v1/me/favorites/${encodeURIComponent(policyId)}`,
    { method: "PUT", headers: getUserHeaders() },
  );
  return response.data;
}

export async function deleteFavoritePolicy(policyId: string): Promise<void> {
  await requestNoContent(
    `/api/v1/me/favorites/${encodeURIComponent(policyId)}`,
    { method: "DELETE", headers: getUserHeaders() },
  );
}
