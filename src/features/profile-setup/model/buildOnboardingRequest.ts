import type { Region } from '@/entities/region';
import {
  codeForLabel,
  EDUCATION_STATUS_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  MAJOR_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  type OnboardingProfileRequestDto,
  SPECIAL_CONDITION_OPTIONS,
  type UserProfile,
} from '@/entities/user';

import { resolveRegionCode } from './resolveRegionCode';

// UI는 한글 라벨로 상태를 들고 있다가, 백엔드에 보낼 때만 코드로 변환한다(제출 실패 시 사용자에게
// 재선택을 요청할 수 있게 null로 실패를 알린다). 필수 항목(지역·취업상태·학력)의 코드를 못 찾으면 null.
export function buildOnboardingRequest(
  draft: UserProfile,
  regions: Region[],
): OnboardingProfileRequestDto | null {
  const regionCode = resolveRegionCode(regions, draft.region, draft.subRegion);
  const employmentStatus = codeForLabel(EMPLOYMENT_STATUS_OPTIONS, draft.employmentStatus);
  const educationLevel = codeForLabel(EDUCATION_STATUS_OPTIONS, draft.educationStatus);
  if (regionCode === null || employmentStatus === null || educationLevel === null) {
    return null;
  }

  const majorCode = draft.major === '' ? null : codeForLabel(MAJOR_OPTIONS, draft.major);

  return {
    birthYear: draft.birthYear,
    regionCode,
    employmentStatus,
    educationLevel,
    maritalStatus: codeForLabel(MARITAL_STATUS_OPTIONS, draft.maritalStatus),
    major: majorCode === null ? [] : [majorCode],
    specialCondition: draft.specialConditions
      .map((label) => codeForLabel(SPECIAL_CONDITION_OPTIONS, label))
      .filter((code): code is string => code !== null),
    income: draft.incomeUnknown ? null : draft.annualIncome,
    categories: draft.interests,
    keywords: draft.keywords,
  };
}
