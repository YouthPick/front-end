import type { RecentlyViewedPolicyDto } from './policy.dto';

// 정책 목록/상세는 실제 API(GET /v1/policies, /v1/policies/{id})로 연동됨(#82).
// 최근 본 정책은 회원 전용 별도 기능(#75)이라 이번 범위 밖 — 목데이터 유지.
export const RECENTLY_VIEWED_POLICY_DTOS: RecentlyViewedPolicyDto[] = [
  { id: '2', category: '주거', title: '청년 월세 한시 특별지원', date: '2025.05.28' },
  { id: '4', category: '일자리', title: '청년내일채움공제', date: '2025.05.27' },
  { id: '6', category: '교육', title: '국민내일배움카드', date: '2025.05.26' },
];
