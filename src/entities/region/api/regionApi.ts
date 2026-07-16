import { apiClient } from '@/shared/api';

import type { RegionDto } from './region.dto';

export async function fetchRegions(): Promise<RegionDto[]> {
  const response = await apiClient.get<{ data: RegionDto[] }>('/v1/admin/regions');
  return response.data.data;
}
