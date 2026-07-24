import { type ApiPageEnvelope, apiClient, toPageResult } from '@/shared/api';
import type { PageParams, PageResult } from '@/shared/types';

import type { ApplicationLogDto, ApplicationLogLevel } from './applicationLog.dto';

export interface ApplicationLogSearchParams extends PageParams {
  logLevel?: ApplicationLogLevel;
  keyword?: string;
  // "YYYY-MM-DD" 형식. 각각 해당일 00:00:00 이상, 23:59:59.999 이하(KST 기준)로 포함한다.
  startDate?: string;
  endDate?: string;
}

export async function fetchApplicationLogs(
  params: ApplicationLogSearchParams,
): Promise<PageResult<ApplicationLogDto>> {
  const response = await apiClient.get<ApiPageEnvelope<ApplicationLogDto>>(
    '/v1/admin/application-logs',
    { params },
  );
  return toPageResult(response.data, params.pageSize);
}
