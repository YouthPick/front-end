export interface UserProfile {
  birthYear: number;
  region: string;
  subRegion: string;
  employmentStatus: string;
  educationStatus: string;
  interests: string[];
  keywords: string[];
}

export interface ProfileOptions {
  regions: string[];
  employmentStatuses: string[];
  educationLevels: string[];
  categories: string[];
  keywords: string[];
  maxInterestCount: number;
  maxKeywordCount: number;
}
