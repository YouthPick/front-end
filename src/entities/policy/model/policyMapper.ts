import type {
  PolicyCardDto,
  PolicyDetailDto,
  PolicyRegionDto,
  RecentlyViewedPolicyDto,
} from '../api/policy.dto';
import type {
  Policy,
  PolicyCategory,
  PolicyLogoType,
  PolicyTag,
  RecentlyViewedPolicy,
} from './policy.types';
import { normalizePolicyCategory } from './policyCategories';
import { UNRESTRICTED_CONDITION } from './policyConditions';

const LOGO_TYPE_BY_CATEGORY: Record<PolicyCategory, PolicyLogoType> = {
  일자리: 'job',
  주거: 'home',
  교육·직업훈련: 'education',
  금융·복지·문화: 'heart',
  참여·기반: 'hand',
};

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
function deriveTag(applicationEndDate: string | null): PolicyTag {
  if (!applicationEndDate) return 'NEW';
  const end = new Date(applicationEndDate);
  if (Number.isNaN(end.getTime())) return 'NEW';
  const diffDays = Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= DEADLINE_SOON_DAYS ? '마감임박' : 'NEW';
}

// 원본 URL에 프로토콜이 없는 값(예: 'www.work.go.kr')이 섞여 있다 — 그대로 href에 넣으면
// 상대경로로 해석돼 우리 페이지로 이동하므로 https를 보정한다. 없으면 ''(Presenter가 버튼 숨김).
function toExternalLink(url: string | null): string {
  if (!url) return '';
  return /^https?:\/\//.test(url) ? url : `https://${url}`;
}

// 상세의 적용 지역 목록을 카드 지역 라벨과 같은 규칙으로 요약한다: 없음→'전국', 1개→시도명, 여러 개→'첫 시도 외 N'.
function regionsToLabel(regions: PolicyRegionDto[]): string {
  const provinces = [
    ...new Set(regions.map((region) => region.provinceName).filter(Boolean)),
  ].sort();
  if (provinces.length === 0) return '전국';
  if (provinces.length === 1) return provinces[0];
  return `${provinces[0]} 외 ${provinces.length - 1}`;
}

// 카테고리를 식별할 수 없는 DTO는 null을 반환하므로 caller가 걸러낸다.
export function mapPolicyCardToPolicy(dto: PolicyCardDto): Policy | null {
  const category = normalizePolicyCategory(dto.category);
  if (!category) return null;

  return {
    id: String(dto.id),
    title: dto.title,
    category,
    region: dto.regionLabel ?? '전국',
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
    logoType: LOGO_TYPE_BY_CATEGORY[category],
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
  return dtos.map(mapPolicyCardToPolicy).filter((policy): policy is Policy => policy !== null);
}

// 상세 응답을 UI Policy로. 카드에 없던 혜택/신청 정보까지 채운다.
export function mapPolicyDetailToPolicy(dto: PolicyDetailDto): Policy | null {
  const category = normalizePolicyCategory(dto.category);
  if (!category) return null;

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
    logoType: LOGO_TYPE_BY_CATEGORY[category],
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

export function mapRecentlyViewedDtoToModel(
  dto: RecentlyViewedPolicyDto,
): RecentlyViewedPolicy | null {
  const category = normalizePolicyCategory(dto.category);
  if (!category) return null;

  return {
    id: dto.id,
    category,
    title: dto.title,
    viewedDate: dto.date,
  };
}
