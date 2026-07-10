import type { CommunityPostCategory } from './communityPost.types';

export const COMMUNITY_POST_CATEGORIES: readonly CommunityPostCategory[] = [
  '정책질문',
  '정책후기',
  '잡담',
];

export function normalizeCommunityPostCategory(value: string): CommunityPostCategory | null {
  const matched = COMMUNITY_POST_CATEGORIES.find((category) => category === value);
  return matched ?? null;
}

// 정책 첨부는 정책과 직접 관련된 카테고리에서만 의미가 있다.
export const POLICY_ATTACHABLE_CATEGORIES: readonly CommunityPostCategory[] = [
  '정책질문',
  '정책후기',
];

export function isPolicyAttachableCategory(category: CommunityPostCategory): boolean {
  return POLICY_ATTACHABLE_CATEGORIES.includes(category);
}
