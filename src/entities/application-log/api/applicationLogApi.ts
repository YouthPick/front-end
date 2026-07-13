import { MOCK_API_DELAY_MS } from '@/shared/constants';
import type { PageParams, PageResult } from '@/shared/types';
import { delay, matchesTextQuery, paginate } from '@/shared/utils';

import type { ApplicationLogDto, ApplicationLogLevel } from './applicationLog.dto';
import { MOCK_APPLICATION_LOG_DTOS } from './applicationLogMockData';

// 백엔드 API가 준비되면 이 파일의 mock 구현만 apiClient 호출로 교체한다.

export interface ApplicationLogSearchParams extends PageParams {
  logLevel?: ApplicationLogLevel;
  keyword?: string;
}

function matchesApplicationLogParams(
  log: ApplicationLogDto,
  params: ApplicationLogSearchParams,
): boolean {
  if (params.logLevel && log.logLevel !== params.logLevel) return false;
  if (!matchesTextQuery([log.message, log.traceId, log.requestUri], params.keyword)) return false;
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
