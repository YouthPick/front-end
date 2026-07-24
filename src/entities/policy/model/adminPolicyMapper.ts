import type { AdminPolicyDto } from '../api/adminPolicy.dto';
import type { AdminPolicy } from './adminPolicy.types';

export function mapAdminPolicyDtoToAdminPolicy(dto: AdminPolicyDto): AdminPolicy {
  return {
    id: dto.id,
    policyNo: dto.policyNo,
    policyName: dto.policyName,
    organizationName: dto.organizationName,
    description: dto.description,
    largeCategory: dto.largeCategory,
    middleCategory: dto.middleCategory,
    applicationStartDate: dto.applicationStartDate,
    applicationEndDate: dto.applicationEndDate,
    applicationUrl: dto.applicationUrl,
    viewCount: dto.viewCount,
    visibilityStatus: dto.visibilityStatus,
    regionCodes: [...dto.regionCodes],
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    deletedAt: dto.deletedAt,
  };
}
