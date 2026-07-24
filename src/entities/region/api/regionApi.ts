import { apiClient } from '@/shared/api';

import type { RegionDto } from './region.dto';

export async function fetchRegions(): Promise<RegionDto[]> {
  const response = await apiClient.get<{ data: RegionDto[] }>('/v1/admin/regions');
  return response.data.data;
}

// 온보딩 등 비회원/일반 회원 화면에서 쓰는 공개 지역 목록. /v1/admin/regions는 ADMIN 권한이 필요해 재사용할 수 없다.
export async function fetchPublicRegions(): Promise<RegionDto[]> {
  const response = await apiClient.get<{ data: RegionDto[] }>('/v1/regions');
  return response.data.data;
}
