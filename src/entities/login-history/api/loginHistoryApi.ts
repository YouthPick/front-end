import { type ApiPageEnvelope, apiClient, toPageResult } from '@/shared/api';
import type { PageParams, PageResult } from '@/shared/types';

import type { LoginHistoryDto } from './loginHistory.dto';

export interface LoginHistorySearchParams extends PageParams {
  userId?: string;
  // "YYYY-MM-DD" 형식. 각각 해당일 00:00:00 이상, 23:59:59.999 이하(KST 기준)로 포함한다.
  startDate?: string;
  endDate?: string;
}

export async function fetchLoginHistories(
  params: LoginHistorySearchParams,
): Promise<PageResult<LoginHistoryDto>> {
  const response = await apiClient.get<ApiPageEnvelope<LoginHistoryDto>>(
    '/v1/admin/login-histories',
    { params },
  );
  return toPageResult(response.data, params.pageSize);
}
