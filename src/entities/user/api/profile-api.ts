import { requestJson, type ApiResponse } from "@shared/api/http";
import type { UserProfile } from "../model/types";
import { getUserJsonHeaders } from "./auth-api";

export interface ProfileResponseDto {
  userId: string;
  status: "COMPLETED" | "SKIPPED";
  birthYear: number;
  region: string;
  subRegion: string;
  employmentStatus: string;
  educationLevel: string;
  categories: string[];
  keywords: string[];
  updatedAt: string;
}

export interface ProfileSaveRequestDto {
  birthYear: number;
  region: string;
  subRegion: string;
  employmentStatus: string;
  educationLevel: string;
  categories: string[];
  keywords: string[];
}

export function profileToSaveRequest(profile: UserProfile): ProfileSaveRequestDto {
  return {
    birthYear: profile.birthYear,
    region: profile.region,
    subRegion: profile.subRegion,
    employmentStatus: profile.employmentStatus,
    educationLevel: profile.educationStatus,
    categories: profile.interests,
    keywords: profile.keywords,
  };
}

export function profileResponseToUserProfile(dto: ProfileResponseDto): UserProfile {
  return {
    birthYear: dto.birthYear,
    region: dto.region,
    subRegion: dto.subRegion,
    employmentStatus: dto.employmentStatus,
    educationStatus: dto.educationLevel,
    interests: dto.categories,
    keywords: dto.keywords,
  };
}

export async function saveUserProfile(profile: UserProfile): Promise<ProfileResponseDto> {
  const response = await requestJson<ApiResponse<ProfileResponseDto>>("/api/v1/me/profile", {
    method: "PUT",
    headers: getUserJsonHeaders(),
    body: JSON.stringify(profileToSaveRequest(profile)),
  });
  return response.data;
}

export async function fetchUserProfile(signal?: AbortSignal): Promise<ProfileResponseDto> {
  const response = await requestJson<ApiResponse<ProfileResponseDto>>("/api/v1/me/profile", {
    headers: getUserJsonHeaders(),
    signal,
  });
  return response.data;
}
