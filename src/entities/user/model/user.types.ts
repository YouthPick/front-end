export type UserRole = 'member' | 'admin';

export interface AuthUser {
  name: string;
  role: UserRole;
}

export interface UserProfile {
  birthYear: number;
  region: string;
  subRegion: string;
  employmentStatus: string;
  educationStatus: string;
  interests: string[];
  keywords: string[];
}
