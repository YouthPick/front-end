export type UserRole = 'member' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  // 로그인에 사용한 소셜 제공자. 콜백 직후에만 알 수 있고, 새로고침 후 세션 복원(/auth/me) 시점에는
  // 서버가 내려주지 않아 비어 있을 수 있다.
  provider?: string;
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
