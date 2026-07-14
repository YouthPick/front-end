import { MOCK_API_DELAY_MS } from '@/shared/constants';
import type { PageParams, PageResult } from '@/shared/types';
import { delay, matchesTextQuery, paginate } from '@/shared/utils';

import type { SearchLogDto } from './searchLog.dto';
import { MOCK_SEARCH_LOG_DTOS } from './searchLogMockData';

// 백엔드 API가 준비되면 이 파일의 mock 구현만 apiClient 호출로 교체한다.

export interface SearchLogSearchParams extends PageParams {
  keyword?: string;
  // "YYYY-MM-DD"(KST 기준). 검색 시각(searchedAt)이 이 범위 안에 있는 로그만 조회한다.
  startDate?: string;
  endDate?: string;
}

function matchesSearchLogParams(log: SearchLogDto, params: SearchLogSearchParams): boolean {
  if (!matchesTextQuery([log.originalQuery, log.normalizedQuery], params.keyword)) return false;

  const searchedAt = new Date(log.searchedAt).getTime();
  if (params.startDate && searchedAt < new Date(`${params.startDate}T00:00:00+09:00`).getTime()) {
    return false;
  }
  if (params.endDate && searchedAt > new Date(`${params.endDate}T23:59:59.999+09:00`).getTime()) {
    return false;
  }

  return true;
}

export async function fetchSearchLogs(
  params: SearchLogSearchParams,
): Promise<PageResult<SearchLogDto>> {
  await delay(MOCK_API_DELAY_MS);

  const filtered = MOCK_SEARCH_LOG_DTOS.filter((log) => matchesSearchLogParams(log, params));
  const paged = paginate(filtered, params.page, params.pageSize);

  return { ...paged, items: paged.items.map((dto) => ({ ...dto })) };
}
