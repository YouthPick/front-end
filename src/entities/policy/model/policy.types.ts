// 온통청년 대분류(lclsfNm) 실제 값 기준. 구분자만 U+00B7(·)로 정규화 — policyCategories.ts 참고.
// '기타'는 원본 category가 없거나(null) 식별 불가일 때의 표시용 fallback — 필터 목록(POLICY_CATEGORIES)에는 없다.
export type PolicyCategory =
  | '일자리'
  | '주거'
  | '교육·직업훈련'
  | '금융·복지·문화'
  | '참여·기반'
  | '기타';

export type PolicyTag = 'HIGH' | '추천' | 'NEW' | '마감임박';

export interface Policy {
  id: string;
  title: string;
  category: PolicyCategory;
  region: string;
  tag: PolicyTag;
  organizationName: string;
  description: string;
  target: string;
  eligibleStatuses: string[];
  // 온보딩 프로필과의 매칭 채점용 정책 조건. 조건 없음 표현은 필드별로 다르다(policy.dto.ts 주석 참고).
  ageMin: number | null;
  ageMax: number | null;
  maritalCondition: string;
  majorCondition: string;
  specialConditionTags: string[];
  incomeMax: number | null;
  deadline: string;
  // 상세 화면에 필드별로 노출하는 구조화된 혜택/신청 정보. 값이 없으면 null.
  supportContent: string | null;
  additionalQualification: string | null;
  applicationMethod: string | null;
  submissionDocuments: string | null;
  screeningMethod: string | null;
  participationRestriction: string | null;
  // 위 필드로 분류되지 않는 기타 안내사항(자유 텍스트 목록)
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
