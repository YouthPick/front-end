export type AdminPolicyVisibilityStatus = 'VISIBLE' | 'HIDDEN';

export interface AdminPolicyDto {
  id: string;
  policyNo: string;
  policyName: string;
  organizationName: string;
  description: string;
  // PolicyCategory 값 중 하나(entities/policy/model/policyCategories 참고).
  largeCategory: string;
  middleCategory: string;
  applicationStartDate: string;
  applicationEndDate: string;
  applicationUrl: string;
  viewCount: number;
  visibilityStatus: AdminPolicyVisibilityStatus;
  // PolicyRegions 매핑을 region_code 배열로 표현한다.
  regionCodes: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
