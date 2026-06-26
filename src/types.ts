export type PolicyCategory = '일자리' | '주거' | '교육' | '복지·문화' | '참여·권리';

export interface Policy {
  id: string;
  title: string;
  category: PolicyCategory;
  region: string;
  tag: 'HIGH' | '추천' | 'NEW' | '마감임박';
  description: string;
  target: string;
  deadline: string;
  logoType: 'job' | 'home' | 'education' | 'heart' | 'hand';
  details: string[];
  link: string;
  isSourceMissing?: boolean; // Added for variant modeling
}

export interface FilterState {
  region: string;
  status: string;
  category: string;
  age: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
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

export interface TrackerChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TrackerItem {
  policyId: string;
  status: '관심' | '준비중' | '신청완료' | '결과대기' | '종료';
  targetDate: string;
  checklist: TrackerChecklistItem[];
  memo: string;
}
