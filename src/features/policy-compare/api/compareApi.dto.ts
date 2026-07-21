// 백엔드 PolicyComparisonItemResponse와 1:1 대응.
// 이 응답은 정책 상세 응답(PolicyDetailResponse)의 부분집합으로 유지된다 — 상세로 볼 때 감춰지는 값이
// 비교로 볼 때만 드러나지 않도록, 자격 판정용 내부 코드(jobCodes/schoolCodes/majorCodes/
// specializationCodes/maritalStatusCode)는 백엔드가 아예 내려주지 않는다.
export interface PolicyComparisonRegionDto {
  regionCode: string;
  provinceName: string;
  districtName: string;
}

export interface PolicyComparisonItemDto {
  policyId: number;
  title: string;
  // 백엔드 Policy 엔티티에 nullable=false가 없어 실제로 null인 데이터가 존재한다.
  category: string | null;
  organizationName: string | null;
  minAge: number | null;
  maxAge: number | null;
  incomeConditionCode: string | null;
  incomeMaxAmount: number | null;
  incomeEtcContent: string | null;
  additionalQualification: string | null;
  participationRestriction: string | null;
  applicationEndDate: string | null;
  applicationUrl: string | null;
  // 지원 지역. 비어 있으면 지역 조건이 등록되지 않은 정책이다.
  regions: PolicyComparisonRegionDto[];
}
