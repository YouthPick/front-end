import type { AdminPolicyVisibilityStatus } from '../api/adminPolicy.dto';

export interface AdminPolicy {
  id: string;
  policyNo: string;
  policyName: string;
  organizationName: string;
  description: string;
  largeCategory: string;
  middleCategory: string;
  applicationStartDate: string;
  applicationEndDate: string;
  applicationUrl: string;
  viewCount: number;
  visibilityStatus: AdminPolicyVisibilityStatus;
  regionCodes: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
