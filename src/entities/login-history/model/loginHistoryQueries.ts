import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { PageResult } from '@/shared/types';

import { fetchLoginHistories, type LoginHistorySearchParams } from '../api/loginHistoryApi';
import type { LoginHistory } from './loginHistory.types';
import { mapLoginHistoryDtoToLoginHistory } from './loginHistoryMapper';

export const loginHistoryKeys = {
  all: ['admin', 'login-histories'] as const,
  list: (params: LoginHistorySearchParams) => ['admin', 'login-histories', 'list', params] as const,
};

export function useLoginHistoriesQuery(params: LoginHistorySearchParams) {
  return useQuery({
    queryKey: loginHistoryKeys.list(params),
    queryFn: async (): Promise<PageResult<LoginHistory>> => {
      const pageDto = await fetchLoginHistories(params);
      return { ...pageDto, items: pageDto.items.map(mapLoginHistoryDtoToLoginHistory) };
    },
    placeholderData: keepPreviousData,
  });
}
