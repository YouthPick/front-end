import type { AdminPolicyApplicationStatus } from '../api/adminPolicyApplication.dto';

export interface AdminPolicyApplication {
  id: string;
  userId: string;
  policyId: string;
  policyName: string;
  status: AdminPolicyApplicationStatus;
  memo: string;
  deadline: string;
  createdAt: string;
}

export interface ApplicationChecklistItem {
  id: string;
  policyApplicationId: string;
  checked: boolean;
  description: string;
  createdAt: string;
}
