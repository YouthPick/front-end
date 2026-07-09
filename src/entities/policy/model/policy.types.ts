export type PolicyCategory = '일자리' | '주거' | '교육' | '복지·문화' | '참여·권리';

export type PolicyTag = 'HIGH' | '추천' | 'NEW' | '마감임박';

export type PolicyLogoType = 'job' | 'home' | 'education' | 'heart' | 'hand';

export interface Policy {
  id: string;
  title: string;
  category: PolicyCategory;
  region: string;
  tag: PolicyTag;
  description: string;
  target: string;
  eligibleStatuses: string[];
  // 온보딩 프로필과의 매칭 채점용 정책 조건. null/빈 배열이면 제한없음으로 취급한다.
  ageMin: number | null;
  ageMax: number | null;
  maritalCondition: string;
  majorCondition: string;
  specialConditionTags: string[];
  incomeMax: number | null;
  deadline: string;
  logoType: PolicyLogoType;
  details: string[];
  link: string;
  isSourceMissing: boolean;
}

export interface RecentlyViewedPolicy {
  id: string;
  category: PolicyCategory;
  title: string;
  viewedDate: string;
}
