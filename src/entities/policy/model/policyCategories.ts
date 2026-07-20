import type { PolicyCategory } from './policy.types';

export const POLICY_CATEGORIES: readonly PolicyCategory[] = [
  '일자리',
  '주거',
  '교육·직업훈련',
  '금융·복지·문화',
  '참여·기반',
];

// 실측(2026-07-16, 2,638건) 기준 백엔드 category 변형: null / 반각점(U+FF65) 구분자 /
// 같은·다른 분류가 콤마로 연결(`일자리,교육`) / 구 분류명(`참여권리`). 배치 정규화(#80) 전까지
// 프론트가 흡수하고, 정규화 후에도 트러스트 바운더리 방어로 유지한다. 키는 점 제거 기준.
const CATEGORY_BY_STRIPPED: Record<string, PolicyCategory> = {
  일자리: '일자리',
  주거: '주거',
  교육: '교육·직업훈련',
  교육직업훈련: '교육·직업훈련',
  복지문화: '금융·복지·문화',
  금융복지문화: '금융·복지·문화',
  참여권리: '참여·기반',
  참여기반: '참여·기반',
};

export function normalizePolicyCategory(value: string | null | undefined): PolicyCategory | null {
  if (!value) return null;
  // 콤마 다중값은 첫 분류를 대표로 쓴다 (카드 뱃지는 단일 분류).
  const first = value.split(',')[0].trim();
  const stripped = first.replace(/[·・･]/g, '');
  return CATEGORY_BY_STRIPPED[stripped] ?? null;
}
