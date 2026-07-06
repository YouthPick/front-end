import type { PolicyCategory } from "./policy.types";

export const POLICY_CATEGORIES: readonly PolicyCategory[] = [
  "일자리",
  "주거",
  "교육",
  "복지·문화",
  "참여·권리",
];

// 외부 데이터에 전각 가운뎃점(・)이 섞여 들어오는 사례를 표준 가운뎃점(·)으로 통일한다.
export function normalizePolicyCategory(value: string): PolicyCategory | null {
  const normalized = value.replace(/・/g, "·");
  const matched = POLICY_CATEGORIES.find((category) => category === normalized);
  return matched ?? null;
}
