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
