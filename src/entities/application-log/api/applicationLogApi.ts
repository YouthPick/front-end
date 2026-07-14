import { MOCK_API_DELAY_MS } from '@/shared/constants';
import type { PageParams, PageResult } from '@/shared/types';
import { delay, matchesTextQuery, paginate } from '@/shared/utils';

import type { ApplicationLogDto, ApplicationLogLevel } from './applicationLog.dto';
import { MOCK_APPLICATION_LOG_DTOS } from './applicationLogMockData';

// 백엔드 API가 준비되면 이 파일의 mock 구현만 apiClient 호출로 교체한다.

export interface ApplicationLogSearchParams extends PageParams {
  logLevel?: ApplicationLogLevel;
  keyword?: string;
  // "YYYY-MM-DD" 형식. 각각 해당일 00:00:00 이상, 23:59:59.999 이하(KST 기준)로 포함한다.
  startDate?: string;
  endDate?: string;
}

function matchesApplicationLogParams(
  log: ApplicationLogDto,
  params: ApplicationLogSearchParams,
): boolean {
  if (params.logLevel && log.logLevel !== params.logLevel) return false;
  if (!matchesTextQuery([log.message, log.traceId, log.requestUri], params.keyword)) return false;

  const createdAt = new Date(log.createdAt).getTime();
  if (params.startDate && createdAt < new Date(`${params.startDate}T00:00:00+09:00`).getTime()) {
    return false;
  }
  if (params.endDate && createdAt > new Date(`${params.endDate}T23:59:59.999+09:00`).getTime()) {
    return false;
  }

  return true;
}

export async function fetchApplicationLogs(
  params: ApplicationLogSearchParams,
): Promise<PageResult<ApplicationLogDto>> {
  await delay(MOCK_API_DELAY_MS);

  const filtered = MOCK_APPLICATION_LOG_DTOS.filter((log) =>
    matchesApplicationLogParams(log, params),
  );
  const paged = paginate(filtered, params.page, params.pageSize);

  return { ...paged, items: paged.items.map((dto) => ({ ...dto })) };
}
