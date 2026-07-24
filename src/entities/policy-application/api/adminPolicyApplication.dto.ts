export type AdminPolicyApplicationStatus = 'INTERESTED' | 'PREPARING' | 'SUBMITTED' | 'CLOSED';

export interface AdminPolicyApplicationDto {
  id: string;
  userId: string;
  policyId: string;
  // 실제 백엔드는 policy_id로 Policies를 조인해 정책명을 함께 내려준다.
  policyName: string;
  status: AdminPolicyApplicationStatus;
  memo: string;
  deadline: string;
  createdAt: string;
}

export interface ApplicationChecklistItemDto {
  id: string;
  policyApplicationId: string;
  checked: boolean;
  description: string;
  createdAt: string;
}
