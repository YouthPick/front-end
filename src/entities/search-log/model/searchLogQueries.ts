import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { PageResult } from '@/shared/types';

import { fetchSearchLogs, type SearchLogSearchParams } from '../api/searchLogApi';
import type { SearchLog } from './searchLog.types';
import { mapSearchLogDtoToSearchLog } from './searchLogMapper';

export const searchLogKeys = {
  all: ['admin', 'search-logs'] as const,
  list: (params: SearchLogSearchParams) => ['admin', 'search-logs', 'list', params] as const,
};

export function useSearchLogsQuery(params: SearchLogSearchParams) {
  return useQuery({
    queryKey: searchLogKeys.list(params),
    queryFn: async (): Promise<PageResult<SearchLog>> => {
      const pageDto = await fetchSearchLogs(params);
      return { ...pageDto, items: pageDto.items.map(mapSearchLogDtoToSearchLog) };
    },
    placeholderData: keepPreviousData,
  });
}
