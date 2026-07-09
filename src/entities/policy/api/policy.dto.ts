export interface PolicyDto {
  id: string;
  title: string;
  category: string;
  region: string;
  tag: string;
  description: string;
  target: string;
  eligibleStatuses: string[];
  // 아래는 온보딩 프로필과의 매칭 채점에 쓰이는 정책 조건. 조건 없음은 필드별로 다르게 표현한다:
  // ageMin/ageMax/incomeMax는 null, specialConditionTags는 빈 배열, maritalCondition/majorCondition은
  // UNRESTRICTED_CONDITION('제한없음') 문자열로 나타낸다.
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
