import { type ApiPageEnvelope, apiClient } from '@/shared/api';
import type { PolicyCardDto, PolicyDetailDto, RecentlyViewedPolicyDto } from './policy.dto';

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

// 연령 필터 라벨 → 백엔드 ageMin/ageMax 구간. 키는 policy-search의 AGES 라벨과 문자열이
// 정확히 일치해야 한다(어긋나면 조용히 무필터). '전체'/미지정은 빈 객체 → 파라미터 미전송.
// 백엔드(#86/#87)는 정책 자격 구간과의 겹침으로 판정하고 min/maxAge 0·NULL은 제한없음 처리한다.
const AGE_RANGE_BY_LABEL: Record<string, { ageMin?: number; ageMax?: number }> = {
  '만 19~34세': { ageMin: 19, ageMax: 34 },
  '만 18세 이하': { ageMax: 18 },
  '만 35세 이상': { ageMin: 35 },
};

function toAgeParams(age: string | undefined): { ageMin?: number; ageMax?: number } {
  return AGE_RANGE_BY_LABEL[age ?? ''] ?? {};
}

export async function fetchPolicies(): Promise<PolicyCardDto[]> {
  return (await fetchPolicySearchPage({}, 1, LIST_PAGE_SIZE)).data;
}

// 홈 그리드용 서버 페이지네이션 — 페이지를 넘길 때마다 해당 페이지만 받아온다.
// page는 1-base. 백엔드가 spring.data.web.pageable.one-indexed-parameters=true로
// 요청·응답(meta.page)을 모두 1-base로 통일했다 — 여기서 0-base로 변환하면 안 된다.
export async function fetchPolicyCardPage(
  page: number,
  size: number,
): Promise<ApiPageEnvelope<PolicyCardDto>> {
  const response = await apiClient.get<ApiPageEnvelope<PolicyCardDto>>('/v1/policies', {
    params: { page, size },
  });
  return response.data;
}

// 커뮤니티 정책 첨부 검색 용도 — 첫 페이지만 필요해 페이지네이션 없이 쓴다.
// 현재 유일한 호출부(usePolicyAttachSearch)는 query만 채워 보낸다.
export async function searchPolicies(params: PolicySearchParams): Promise<PolicyCardDto[]> {
  return (await fetchPolicySearchPage(params, 1, LIST_PAGE_SIZE)).data;
}

// 검색 화면 서버 페이지네이션. keyword·region·category·age(→ ageMin/ageMax)는 백엔드가
// 필터링한다(#86/#87). status는 아직 서버 미지원 — 보내지 않는다.
// page는 1-base. 백엔드가 one-indexed-parameters=true로 요청·응답(meta.page)을 모두
// 1-base로 통일했다 — 여기서 0-base로 변환하면 안 된다(#126).
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
      ...toAgeParams(params.age),
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
  return [];
}
