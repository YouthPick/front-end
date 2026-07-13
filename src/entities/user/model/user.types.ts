export type UserRole = 'member' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  provider: string;
  role: UserRole;
}

export interface UserProfile {
  birthYear: number;
  region: string;
  subRegion: string;
  employmentStatus: string;
  educationStatus: string;
  maritalStatus: string;
  major: string;
  specialConditions: string[];
  annualIncome: number | null;
  incomeUnknown: boolean;
  interests: string[];
  keywords: string[];
  // 온보딩 마법사를 끝까지 완료했는지 여부. interests가 선택 항목이 되며 완료 판단 기준을 분리했다.
  isOnboarded: boolean;
}
