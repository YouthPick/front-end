import { MOCK_API_DELAY_MS } from '@/shared/constants';
import type { PageParams, PageResult } from '@/shared/types';
import { delay, paginate } from '@/shared/utils';

import type { LoginHistoryDto } from './loginHistory.dto';
import { MOCK_LOGIN_HISTORY_DTOS } from './loginHistoryMockData';

// 백엔드 API가 준비되면 이 파일의 mock 구현만 apiClient 호출로 교체한다.

export interface LoginHistorySearchParams extends PageParams {
  userId?: string;
  // "YYYY-MM-DD" 형식. 각각 해당일 00:00:00 이상, 23:59:59.999 이하로 포함한다.
  startDate?: string;
  endDate?: string;
}

function matchesLoginHistoryParams(
  history: LoginHistoryDto,
  params: LoginHistorySearchParams,
): boolean {
  if (params.userId && history.userId !== params.userId) return false;

  const createdAt = new Date(history.createdAt).getTime();
  if (params.startDate && createdAt < new Date(`${params.startDate}T00:00:00`).getTime()) {
    return false;
  }
  if (params.endDate && createdAt > new Date(`${params.endDate}T23:59:59.999`).getTime()) {
    return false;
  }

  return true;
}

export async function fetchLoginHistories(
  params: LoginHistorySearchParams,
): Promise<PageResult<LoginHistoryDto>> {
  await delay(MOCK_API_DELAY_MS);

  const filtered = MOCK_LOGIN_HISTORY_DTOS.filter((history) =>
    matchesLoginHistoryParams(history, params),
  );
  const paged = paginate(filtered, params.page, params.pageSize);

  return { ...paged, items: paged.items.map((dto) => ({ ...dto })) };
}
