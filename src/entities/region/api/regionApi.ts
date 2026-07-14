import { MOCK_API_DELAY_MS } from '@/shared/constants';
import { delay } from '@/shared/utils';

import type { RegionDto } from './region.dto';
import { MOCK_REGION_DTOS } from './regionMockData';

// 백엔드 API가 준비되면 이 파일의 mock 구현만 apiClient 호출로 교체한다.
export async function fetchRegions(): Promise<RegionDto[]> {
  await delay(MOCK_API_DELAY_MS);
  return MOCK_REGION_DTOS.map((dto) => ({ ...dto }));
}
