import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { PageResult } from '@/shared/types';

import { type ApplicationLogSearchParams, fetchApplicationLogs } from '../api/applicationLogApi';
import type { ApplicationLog } from './applicationLog.types';
import { mapApplicationLogDtoToApplicationLog } from './applicationLogMapper';

export const applicationLogKeys = {
  all: ['admin', 'application-logs'] as const,
  list: (params: ApplicationLogSearchParams) =>
    ['admin', 'application-logs', 'list', params] as const,
};

export function useApplicationLogsQuery(params: ApplicationLogSearchParams) {
  return useQuery({
    queryKey: applicationLogKeys.list(params),
    queryFn: async (): Promise<PageResult<ApplicationLog>> => {
      const pageDto = await fetchApplicationLogs(params);
      return { ...pageDto, items: pageDto.items.map(mapApplicationLogDtoToApplicationLog) };
    },
    placeholderData: keepPreviousData,
  });
}
