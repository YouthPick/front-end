import type { AdminUserDto, AdminUserProfileDto } from '../api/adminUser.dto';
import type { AdminUser, AdminUserProfile } from './adminUser.types';

export function mapAdminUserDtoToAdminUser(dto: AdminUserDto): AdminUser {
  return {
    id: dto.id,
    provider: dto.provider,
    providerSubject: dto.providerSubject,
    role: dto.role,
    createdAt: dto.createdAt,
    deletedAt: dto.deletedAt,
  };
}

export function mapAdminUserProfileDtoToAdminUserProfile(
  dto: AdminUserProfileDto,
): AdminUserProfile {
  return {
    userId: dto.userId,
    birthYear: dto.birthYear,
    employmentStatus: dto.employmentStatus,
    educationLevel: dto.educationLevel,
    categories: [...dto.categories],
    keywords: [...dto.keywords],
    status: dto.status,
    regionLabel: dto.regionLabel,
    marriageStatus: dto.marriageStatus,
    major: dto.major,
    specializedCondition: dto.specializedCondition,
    annualIncome: dto.annualIncome,
  };
}
