import type { UserRole } from '../model/user.types';

export interface AdminUserDto {
  id: string;
  provider: string;
  providerSubject: string;
  role: UserRole;
  createdAt: string;
  deletedAt: string | null;
}

export interface AdminUserProfileDto {
  userId: string;
  birthYear: number;
  employmentStatus: string;
  educationLevel: string;
  categories: string[];
  keywords: string[];
  status: string;
  // region_code를 Regions와 조인한 표시용 라벨. 실제 백엔드는 region_code만 내려주고 프론트가 조인하거나
  // 백엔드가 이미 조인한 라벨을 함께 내려줄 수 있다.
  regionLabel: string;
  marriageStatus: string;
  major: string;
  specializedCondition: string;
  annualIncome: number | null;
}
