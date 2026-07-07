import { delay } from "@/shared/utils";
import type { PolicyDto, RecentlyViewedPolicyDto } from "./policy.dto";
import { MOCK_POLICY_DTOS, RECENTLY_VIEWED_POLICY_DTOS } from "./policyMockData";

// 백엔드 API가 준비되면 이 파일의 mock 구현만 apiClient 호출로 교체한다.
const MOCK_API_DELAY_MS = 250;

export interface PolicySearchParams {
  query?: string;
  region?: string;
  status?: string;
  category?: string;
  age?: string;
}

function cloneDto(dto: PolicyDto): PolicyDto {
  return { ...dto, details: [...dto.details] };
}

function normalizeCategory(value: string): string {
  return value.replace(/・/g, "·");
}

function matchesSearchParams(policy: PolicyDto, params: PolicySearchParams): boolean {
  const query = params.query?.trim().toLowerCase() ?? "";
  if (query !== "") {
    const matchesQuery =
      policy.title.toLowerCase().includes(query) ||
      policy.category.toLowerCase().includes(query) ||
      policy.description.toLowerCase().includes(query);
    if (!matchesQuery) return false;
  }

  if (params.region && params.region !== "전체" && policy.region !== "전국") {
    if (policy.region !== params.region) return false;
  }

  if (params.category && params.category !== "전체") {
    if (normalizeCategory(policy.category) !== normalizeCategory(params.category)) return false;
  }

  if (params.age && params.age !== "전체" && policy.target !== "전체" && policy.target !== params.age) {
    return false;
  }

  if (
    params.status &&
    params.status !== "전체" &&
    !policy.eligibleStatuses.includes("전체") &&
    !policy.eligibleStatuses.includes(params.status)
  ) {
    return false;
  }

  return true;
}

export async function fetchPolicies(): Promise<PolicyDto[]> {
  await delay(MOCK_API_DELAY_MS);
  return MOCK_POLICY_DTOS.map(cloneDto);
}

export async function searchPolicies(params: PolicySearchParams): Promise<PolicyDto[]> {
  await delay(MOCK_API_DELAY_MS);
  return MOCK_POLICY_DTOS.filter((policy) => matchesSearchParams(policy, params)).map(cloneDto);
}

export async function fetchPolicy(policyId: string): Promise<PolicyDto | null> {
  await delay(MOCK_API_DELAY_MS);
  const found = MOCK_POLICY_DTOS.find((policy) => policy.id === policyId);
  return found ? cloneDto(found) : null;
}

export async function fetchRecentlyViewedPolicies(): Promise<RecentlyViewedPolicyDto[]> {
  await delay(MOCK_API_DELAY_MS);
  return RECENTLY_VIEWED_POLICY_DTOS.map((dto) => ({ ...dto }));
}
