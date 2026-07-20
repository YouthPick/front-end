export interface OnboardingProfileRequestDto {
  birthYear: number;
  regionCode: string;
  employmentStatus: string;
  educationLevel: string;
  merryStatus: string | null;
  major: string[];
  specialCondition: string[];
  income: number | null;
  categories: string[];
  keywords: string[];
}

export interface OnboardingProfileResponseDto {
  id: number;
  userId: number;
  birthYear: number;
  regionCode: string;
  employmentStatus: string;
  educationLevel: string;
  merryStatus: string | null;
  major: string[];
  specialCondition: string[];
  income: number | null;
  categories: string[];
  keywords: string[];
  status: string;
}
