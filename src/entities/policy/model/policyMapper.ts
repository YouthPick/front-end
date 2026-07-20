import type {
  PolicyCardDto,
  PolicyDetailDto,
  PolicyRegionDto,
  RecentlyViewedPolicyDto,
} from '../api/policy.dto';
import type { Policy, PolicyTag, RecentlyViewedPolicy } from './policy.types';
import { normalizePolicyCategory } from './policyCategories';
import { UNRESTRICTED_CONDITION } from './policyConditions';

// 마감일이 이 일수 이내로 남으면 '마감임박' 태그를 붙인다.
const DEADLINE_SOON_DAYS = 7;

// 나이 조건을 카드/상세의 '지원 대상' 문구로 조립한다. 둘 다 없으면 '전체'.
function formatAgeTarget(minAge: number | null, maxAge: number | null): string {
  if (minAge == null && maxAge == null) return '전체';
  if (minAge != null && maxAge != null) return `만 ${minAge}~${maxAge}세`;
  if (minAge != null) return `만 ${minAge}세 이상`;
  return `만 ${maxAge}세 이하`;
}

// 마감일(YYYY-MM-DD)을 표시용(YYYY.MM.DD)으로. 없으면 '상시'.
function formatDeadline(applicationEndDate: string | null): string {
  if (!applicationEndDate) return '상시';
  return applicationEndDate.replaceAll('-', '.');
}

// 백엔드가 태그를 주지 않으므로 마감일 기준으로 파생한다. 마감 임박이면 '마감임박', 아니면 'NEW'.
// 'YYYY-MM-DD'를 new Date(문자열)로 파싱하면 UTC 자정으로 해석돼 KST 00~09시에 하루 오차가
// 나므로, 로컬 자정끼리의 달력일 차이로 계산한다. 마감 당일(diff 0)은 '마감임박'.
function deriveTag(applicationEndDate: string | null): PolicyTag {
  if (!applicationEndDate) return 'NEW';
  const [year, month, day] = applicationEndDate.split('-').map(Number);
  if (!year || !month || !day) return 'NEW';
  const end = new Date(year, month - 1, day);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= DEADLINE_SOON_DAYS ? '마감임박' : 'NEW';
}

// 원본 URL에 프로토콜이 없는 값(예: 'www.work.go.kr')이 섞여 있다 — 그대로 href에 넣으면
// 상대경로로 해석돼 우리 페이지로 이동하므로 https를 보정한다. 없으면 ''(Presenter가 버튼 숨김).
function toExternalLink(url: string | null): string {
  if (!url) return '';
  return /^https?:\/\//.test(url) ? url : `https://${url}`;
}

// 시도명 목록을 카드·상세 공통 규칙으로 요약한다: 없음→'전국', 1개→시도명, 여러 개→'첫 시도 외 N'.
// 백엔드는 원본 시도명 목록만 내려주고(카드: PolicyCardResponse.provinces, 상세: PolicyDetailResponse.regions),
// "전국"/"외 N" 같은 표시 문구 조립은 여기 프론트에서만 한다.
function provincesToLabel(provinces: string[]): string {
  const distinct = [...new Set(provinces.filter(Boolean))].sort();
  if (distinct.length === 0) return '전국';
  if (distinct.length === 1) return distinct[0];
  return `${distinct[0]} 외 ${distinct.length - 1}`;
}

function regionsToLabel(regions: PolicyRegionDto[]): string {
  return provincesToLabel(regions.map((region) => region.provinceName));
}

// 카테고리를 식별할 수 없는 정책도 숨기지 않고 '기타'로 노출한다 — 서버 페이지당 개수와 화면 개수를 일치시킨다.
export function mapPolicyCardToPolicy(dto: PolicyCardDto): Policy {
  const category = normalizePolicyCategory(dto.category) ?? '기타';

  return {
    id: String(dto.id),
    title: dto.title,
    category,
    region: provincesToLabel(dto.provinces),
    tag: deriveTag(dto.applicationEndDate),
    // 카드 응답에 없는 상세 필드는 상세 조회에서 채운다.
    organizationName: '',
    description: dto.description ?? '',
    target: formatAgeTarget(dto.minAge, dto.maxAge),
    eligibleStatuses: [],
    ageMin: dto.minAge,
    ageMax: dto.maxAge,
    maritalCondition: UNRESTRICTED_CONDITION,
    majorCondition: UNRESTRICTED_CONDITION,
    specialConditionTags: [],
    incomeMax: null,
    deadline: formatDeadline(dto.applicationEndDate),
    supportContent: null,
    additionalQualification: null,
    applicationMethod: null,
    submissionDocuments: null,
    screeningMethod: null,
    participationRestriction: null,
    details: [],
    link: '',
    isSourceMissing: false,
  };
}

export function mapPolicyCardsToPolicies(dtos: PolicyCardDto[]): Policy[] {
  return dtos.map(mapPolicyCardToPolicy);
}

// 상세 응답을 UI Policy로. 카드에 없던 혜택/신청 정보까지 채운다.
export function mapPolicyDetailToPolicy(dto: PolicyDetailDto): Policy {
  const category = normalizePolicyCategory(dto.category) ?? '기타';

  return {
    id: String(dto.id),
    title: dto.title,
    category,
    region: regionsToLabel(dto.regions),
    tag: deriveTag(dto.applicationEndDate),
    organizationName: dto.organizationName ?? '',
    description: dto.description ?? '',
    target: formatAgeTarget(dto.minAge, dto.maxAge),
    eligibleStatuses: [],
    ageMin: dto.minAge,
    ageMax: dto.maxAge,
    maritalCondition: UNRESTRICTED_CONDITION,
    majorCondition: UNRESTRICTED_CONDITION,
    specialConditionTags: [],
    incomeMax: dto.incomeMaxAmount,
    deadline: formatDeadline(dto.applicationEndDate),
    supportContent: dto.supportContent,
    additionalQualification: dto.additionalQualification,
    applicationMethod: dto.applicationMethod,
    submissionDocuments: dto.submissionDocuments,
    screeningMethod: dto.screeningMethod,
    participationRestriction: dto.participationRestriction,
    details: [],
    link: toExternalLink(dto.applicationUrl ?? dto.referenceUrl1),
    isSourceMissing: false,
  };
}

export function mapRecentlyViewedDtoToModel(dto: RecentlyViewedPolicyDto): RecentlyViewedPolicy {
  return {
    id: dto.id,
    category: normalizePolicyCategory(dto.category) ?? '기타',
    title: dto.title,
    viewedDate: dto.date,
  };
}
