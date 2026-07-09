export interface PolicyDto {
  id: string;
  title: string;
  category: string;
  region: string;
  tag: string;
  description: string;
  target: string;
  eligibleStatuses: string[];
  // 아래는 온보딩 프로필과의 매칭 채점에 쓰이는 정책 조건. 값이 없으면(null/빈 배열) 제한없음으로 취급한다.
  ageMin: number | null;
  ageMax: number | null;
  maritalCondition: string;
  majorCondition: string;
  specialConditionTags: string[];
  incomeMax: number | null;
  deadline: string;
  logoType: string;
  details: string[];
  link: string;
  isSourceMissing?: boolean;
}

export interface RecentlyViewedPolicyDto {
  id: string;
  category: string;
  title: string;
  date: string;
}
