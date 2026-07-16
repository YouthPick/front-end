import type { PolicyCategory } from './policy.types';

export const POLICY_CATEGORIES: readonly PolicyCategory[] = [
  '일자리',
  '주거',
  '교육',
  '복지·문화',
  '참여·권리',
];

// 백엔드 category는 온통청년 대분류 원본(예: '복지문화', '참여권리')이라 가운뎃점이 없거나
// 전각(・)이 섞일 수 있다. 가운뎃점을 무시하고 5개 표준 분류와 매칭한다. 매칭 불가는 null.
export function normalizePolicyCategory(value: string): PolicyCategory | null {
  const stripped = value.replace(/[·・]/g, '');
  return POLICY_CATEGORIES.find((category) => category.replace(/·/g, '') === stripped) ?? null;
}
