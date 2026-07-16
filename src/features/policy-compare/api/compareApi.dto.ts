// 백엔드 PolicyComparisonItemResponse와 1:1 대응. job/school/marital/major/specialization 코드는
// 디코딩 매핑표가 없는 원본 코드값이라 UI에는 노출하지 않고, DTO에는 응답 형태 그대로 보존한다.
export interface PolicyComparisonItemDto {
  policyId: number;
  title: string;
  // 백엔드 Policy 엔티티에 nullable=false가 없어 실제로 null인 데이터가 존재한다.
  category: string | null;
  organizationName: string | null;
  minAge: number | null;
  maxAge: number | null;
  jobCodes: string | null;
  schoolCodes: string | null;
  incomeConditionCode: string | null;
  incomeMaxAmount: number | null;
  incomeEtcContent: string | null;
  maritalStatusCode: string | null;
  majorCodes: string | null;
  specializationCodes: string | null;
  additionalQualification: string | null;
  participationRestriction: string | null;
  applicationEndDate: string | null;
  applicationUrl: string | null;
}

export interface PolicyComparisonResponseDto {
  comparisonId: string;
  policies: PolicyComparisonItemDto[];
}
