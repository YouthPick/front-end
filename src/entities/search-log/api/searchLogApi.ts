import { type ApiPageEnvelope, apiClient, toPageResult } from '@/shared/api';
import type { PageParams, PageResult } from '@/shared/types';

import type { SearchLogDto } from './searchLog.dto';

export interface SearchLogSearchParams extends PageParams {
  keyword?: string;
  // "YYYY-MM-DD"(KST 기준). 검색 시각(searchedAt)이 이 범위 안에 있는 로그만 조회한다.
  startDate?: string;
  endDate?: string;
}

export async function fetchSearchLogs(
  params: SearchLogSearchParams,
): Promise<PageResult<SearchLogDto>> {
  const response = await apiClient.get<ApiPageEnvelope<SearchLogDto>>('/v1/admin/search-logs', {
    params,
  });
  return toPageResult(response.data, params.pageSize);
}
