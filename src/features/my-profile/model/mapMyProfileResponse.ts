import type { Region } from '@/entities/region';
import {
  EDUCATION_STATUS_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  labelForCode,
  MAJOR_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  type OnboardingProfileResponseDto,
  SPECIAL_CONDITION_OPTIONS,
  type UserProfile,
} from '@/entities/user';

// 온보딩 제출 시(resolveRegionCode) 시·군·구 미선택은 districtName === provinceName인 시·도 대표 코드로
// 저장되므로, 조회 시에도 그 경우 subRegion을 빈 문자열로 되돌려 같은 표시 형태를 유지한다.
function resolveRegionNames(
  regions: Region[],
  regionCode: string,
): { region: string; subRegion: string } {
  const matched = regions.find((region) => region.regionCode === regionCode);
  if (!matched) return { region: '', subRegion: '' };
  return {
    region: matched.provinceName,
    subRegion: matched.districtName === matched.provinceName ? '' : matched.districtName,
  };
}

export function mapMyProfileResponse(
  dto: OnboardingProfileResponseDto,
  regions: Region[],
): UserProfile {
  const { region, subRegion } = resolveRegionNames(regions, dto.regionCode);
  const [majorCode] = dto.major;

  return {
    birthYear: dto.birthYear,
    region,
    subRegion,
    employmentStatus: labelForCode(EMPLOYMENT_STATUS_OPTIONS, dto.employmentStatus) ?? '',
    educationStatus: labelForCode(EDUCATION_STATUS_OPTIONS, dto.educationLevel) ?? '',
    maritalStatus: dto.merryStatus
      ? (labelForCode(MARITAL_STATUS_OPTIONS, dto.merryStatus) ?? '')
      : '',
    major: majorCode ? (labelForCode(MAJOR_OPTIONS, majorCode) ?? '') : '',
    specialConditions: dto.specialCondition.map(
      (code) => labelForCode(SPECIAL_CONDITION_OPTIONS, code) ?? code,
    ),
    // 백엔드는 "소득 무관"과 "미설정"을 둘 다 income=null로 저장해 구분하지 못한다(온보딩 제출 시 유실).
    // 조회 시점에는 미설정으로만 표시한다.
    annualIncome: dto.income,
    incomeUnknown: false,
    interests: [...dto.categories],
    keywords: [...dto.keywords],
    isOnboarded: true,
  };
}
