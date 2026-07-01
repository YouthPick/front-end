import { requestJson, type ApiResponse } from "@shared/api/http";

export interface ProfileOptionsDto {
  regions: string[];
  employmentStatuses: string[];
  educationLevels: string[];
  categories: string[];
  keywords: string[];
  maxInterestCount: number;
  maxKeywordCount: number;
}

export async function fetchProfileOptions(signal?: AbortSignal): Promise<ProfileOptionsDto> {
  const response = await requestJson<ApiResponse<ProfileOptionsDto>>("/api/v1/meta/profile-options", { signal });
  return response.data;
}
