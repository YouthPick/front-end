import type { UserRole } from './user.types';

export interface AdminUser {
  id: string;
  provider: string;
  providerSubject: string;
  role: UserRole;
  createdAt: string;
  deletedAt: string | null;
}

export interface AdminUserProfile {
  userId: string;
  birthYear: number;
  employmentStatus: string;
  educationLevel: string;
  categories: string[];
  keywords: string[];
  status: string;
  regionLabel: string;
  marriageStatus: string;
  major: string;
  specializedCondition: string;
  annualIncome: number | null;
}
