import type { PolicyDto, RecentlyViewedPolicyDto } from '../api/policy.dto';
import type { Policy, PolicyLogoType, PolicyTag, RecentlyViewedPolicy } from './policy.types';
import { normalizePolicyCategory } from './policyCategories';

const POLICY_TAGS: readonly PolicyTag[] = ['HIGH', '추천', 'NEW', '마감임박'];
const POLICY_LOGO_TYPES: readonly PolicyLogoType[] = ['job', 'home', 'education', 'heart', 'hand'];

function toPolicyTag(value: string): PolicyTag {
  const matched = POLICY_TAGS.find((tag) => tag === value);
  return matched ?? 'NEW';
}

function toPolicyLogoType(value: string): PolicyLogoType {
  const matched = POLICY_LOGO_TYPES.find((logoType) => logoType === value);
  return matched ?? 'job';
}

// 카테고리를 식별할 수 없는 DTO는 null을 반환하므로 caller가 걸러낸다.
export function mapPolicyDtoToPolicy(dto: PolicyDto): Policy | null {
  const category = normalizePolicyCategory(dto.category);
  if (!category) return null;

  return {
    id: dto.id,
    title: dto.title,
    category,
    region: dto.region,
    tag: toPolicyTag(dto.tag),
    description: dto.description,
    target: dto.target,
    eligibleStatuses: [...dto.eligibleStatuses],
    ageMin: dto.ageMin,
    ageMax: dto.ageMax,
    maritalCondition: dto.maritalCondition,
    majorCondition: dto.majorCondition,
    specialConditionTags: [...dto.specialConditionTags],
    incomeMax: dto.incomeMax,
    deadline: dto.deadline,
    logoType: toPolicyLogoType(dto.logoType),
    supportContent: dto.supportContent,
    additionalQualification: dto.additionalQualification,
    applicationMethod: dto.applicationMethod,
    submissionDocuments: dto.submissionDocuments,
    screeningMethod: dto.screeningMethod,
    participationRestriction: dto.participationRestriction,
    details: [...dto.details],
    link: dto.link,
    isSourceMissing: dto.isSourceMissing ?? false,
  };
}

export function mapPolicyDtosToPolicies(dtos: PolicyDto[]): Policy[] {
  return dtos.map(mapPolicyDtoToPolicy).filter((policy): policy is Policy => policy !== null);
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
