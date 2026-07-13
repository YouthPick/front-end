import { MOCK_API_DELAY_MS } from '@/shared/constants';
import type { PageParams, PageResult } from '@/shared/types';
import { delay } from '@/shared/utils';

import type { LoginHistoryDto } from './loginHistory.dto';
import { MOCK_LOGIN_HISTORY_DTOS } from './loginHistoryMockData';

// 백엔드 API가 준비되면 이 파일의 mock 구현만 apiClient 호출로 교체한다.

export interface LoginHistorySearchParams extends PageParams {
  userId?: string;
}

export async function fetchLoginHistories(
  params: LoginHistorySearchParams,
): Promise<PageResult<LoginHistoryDto>> {
  await delay(MOCK_API_DELAY_MS);

  const filtered = MOCK_LOGIN_HISTORY_DTOS.filter((history) =>
    params.userId ? history.userId === params.userId : true,
  );
  const start = (params.page - 1) * params.pageSize;
  const items = filtered.slice(start, start + params.pageSize).map((dto) => ({ ...dto }));

  return {
    items,
    page: params.page,
    pageSize: params.pageSize,
    totalCount: filtered.length,
  };
}
