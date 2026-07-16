import type { ComparisonPolicy } from '../types/comparisonPolicy.types';
import type { PolicyComparisonItemDto } from './compareApi.dto';

const NO_INFO = '정보 없음';

function formatAgeRange(minAge: number | null, maxAge: number | null): string {
  if (minAge == null && maxAge == null) return '제한없음';
  if (minAge != null && maxAge != null) return `만 ${minAge}세~${maxAge}세`;
  if (minAge != null) return `만 ${minAge}세 이상`;
  return `만 ${maxAge}세 이하`;
}

// incomeConditionCode는 디코딩 매핑표가 없어 incomeMaxAmount가 0/누락일 때 "무관"인지 실제 조건인지
// 구분할 수 없다. 확정할 수 없는 값을 단정하지 않도록 그런 경우엔 NO_INFO로 처리한다.
function formatIncome(incomeMaxAmount: number | null, incomeEtcContent: string | null): string {
  if (incomeEtcContent) return incomeEtcContent;
  if (incomeMaxAmount) return `연 소득 ${incomeMaxAmount.toLocaleString('ko-KR')}만원 이하`;
  return NO_INFO;
}

function formatApplicationEndDate(applicationEndDate: string | null): string {
  if (!applicationEndDate) return NO_INFO;
  return applicationEndDate.replace(/-/g, '.');
}

export function mapPolicyComparisonItemDtoToComparisonPolicy(
  dto: PolicyComparisonItemDto,
): ComparisonPolicy {
  return {
    policyId: dto.policyId,
    title: dto.title,
    category: dto.category ?? NO_INFO,
    organizationName: dto.organizationName ?? NO_INFO,
    ageRangeText: formatAgeRange(dto.minAge, dto.maxAge),
    incomeText: formatIncome(dto.incomeMaxAmount, dto.incomeEtcContent),
    additionalQualification: dto.additionalQualification ?? NO_INFO,
    participationRestriction: dto.participationRestriction ?? NO_INFO,
    applicationEndDateText: formatApplicationEndDate(dto.applicationEndDate),
    applicationUrl: dto.applicationUrl,
  };
}

export function mapPolicyComparisonItemDtosToComparisonPolicies(
  dtos: PolicyComparisonItemDto[],
): ComparisonPolicy[] {
  return dtos.map(mapPolicyComparisonItemDtoToComparisonPolicy);
}
