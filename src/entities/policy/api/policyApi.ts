import { type ApiPageEnvelope, apiClient } from '@/shared/api';
import { MOCK_API_DELAY_MS } from '@/shared/constants';
import { delay } from '@/shared/utils';
import type { PolicyCardDto, PolicyDetailDto, RecentlyViewedPolicyDto } from './policy.dto';
import { RECENTLY_VIEWED_POLICY_DTOS } from './policyMockData';

export interface PolicySearchParams {
  query?: string;
  region?: string;
  status?: string;
  category?: string;
  age?: string;
}

// ponytail: 최신 LIST_PAGE_SIZE건만 받는 '요약 전체 목록'. 현재 소비자는 추천(useRecommendations)과
// 비교함 독(#90에서 교체 예정)뿐이다. 전량 채점이 필요해지면 백엔드 추천 API로 이관한다.
const LIST_PAGE_SIZE = 100;

const DEFAULT_FILTER = '전체';

// '전체'(필터 미선택)와 빈 값은 쿼리에서 빼 백엔드가 조건 없이 조회하게 한다.
function toFilterParam(value: string | undefined): string | undefined {
  if (!value || value === DEFAULT_FILTER) return undefined;
  return value;
}

export async function fetchPolicies(): Promise<PolicyCardDto[]> {
  return (await fetchPolicyCardPage(0, LIST_PAGE_SIZE)).data;
}

// 홈 그리드용 서버 페이지네이션 — 페이지를 넘길 때마다 해당 페이지만 받아온다. page는 0-base.
export async function fetchPolicyCardPage(
  page: number,
  size: number,
): Promise<ApiPageEnvelope<PolicyCardDto>> {
  const response = await apiClient.get<ApiPageEnvelope<PolicyCardDto>>('/v1/policies', {
    params: { page, size },
  });
  return response.data;
}

export async function searchPolicies(params: PolicySearchParams): Promise<PolicyCardDto[]> {
  // 백엔드 검색은 keyword/region/category만 받는다. status·age 필터는 아직 미지원(검색 작업에서 연결).
  const response = await apiClient.get<ApiPageEnvelope<PolicyCardDto>>('/v1/policies', {
    params: {
      keyword: toFilterParam(params.query),
      region: toFilterParam(params.region),
      category: toFilterParam(params.category),
      page: 0,
      size: LIST_PAGE_SIZE,
    },
  });
  return response.data.data;
}

// 검색 화면 서버 페이지네이션. category는 백엔드가 필터링하고,
// keyword·region·status·age는 아직 서버 미지원(#36 검색 작업에서 연결) — 파라미터만 미리 보낸다.
export async function fetchPolicySearchPage(
  params: PolicySearchParams,
  page: number,
  size: number,
): Promise<ApiPageEnvelope<PolicyCardDto>> {
  const response = await apiClient.get<ApiPageEnvelope<PolicyCardDto>>('/v1/policies', {
    params: {
      keyword: toFilterParam(params.query),
      region: toFilterParam(params.region),
      category: toFilterParam(params.category),
      page,
      size,
    },
  });
  return response.data;
}

// 404(P001)면 apiClient가 예외를 던진다 — caller(상세 쿼리)가 에러 상태로 처리한다.
export async function fetchPolicy(policyId: string): Promise<PolicyDetailDto> {
  const response = await apiClient.get<{ data: PolicyDetailDto }>(`/v1/policies/${policyId}`);
  return response.data.data;
}

export async function fetchRecentlyViewedPolicies(): Promise<RecentlyViewedPolicyDto[]> {
  // ponytail: 회원 전용 최근 본 정책(#75)은 이번 범위 밖 — 목데이터 유지. 실 API 연동은 별도 이슈.
  await delay(MOCK_API_DELAY_MS);
  return RECENTLY_VIEWED_POLICY_DTOS.map((dto) => ({ ...dto }));
}
