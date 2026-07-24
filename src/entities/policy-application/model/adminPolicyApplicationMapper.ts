import type {
  AdminPolicyApplicationDto,
  ApplicationChecklistItemDto,
} from '../api/adminPolicyApplication.dto';
import type {
  AdminPolicyApplication,
  ApplicationChecklistItem,
} from './adminPolicyApplication.types';

export function mapAdminPolicyApplicationDtoToAdminPolicyApplication(
  dto: AdminPolicyApplicationDto,
): AdminPolicyApplication {
  return {
    id: dto.id,
    userId: dto.userId,
    policyId: dto.policyId,
    policyName: dto.policyName,
    status: dto.status,
    memo: dto.memo,
    deadline: dto.deadline,
    createdAt: dto.createdAt,
  };
}

export function mapApplicationChecklistItemDtoToApplicationChecklistItem(
  dto: ApplicationChecklistItemDto,
): ApplicationChecklistItem {
  return {
    id: dto.id,
    policyApplicationId: dto.policyApplicationId,
    checked: dto.checked,
    description: dto.description,
    createdAt: dto.createdAt,
  };
}
