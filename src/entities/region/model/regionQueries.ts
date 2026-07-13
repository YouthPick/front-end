import { useQuery } from '@tanstack/react-query';

import { fetchRegions } from '../api/regionApi';
import { mapRegionDtoToRegion } from './regionMapper';

export const regionKeys = {
  all: ['regions'] as const,
};

export function useRegionsQuery() {
  return useQuery({
    queryKey: regionKeys.all,
    queryFn: async () => (await fetchRegions()).map(mapRegionDtoToRegion),
    // 참조 데이터라 자주 바뀌지 않으므로 세션 내에서는 다시 조회하지 않는다.
    staleTime: Number.POSITIVE_INFINITY,
  });
}
