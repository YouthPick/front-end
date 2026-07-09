export type CommunityPostSortOption = 'latest' | 'views' | 'comments' | 'likes';

export const COMMUNITY_POST_SORT_OPTIONS: readonly {
  value: CommunityPostSortOption;
  label: string;
}[] = [
  { value: 'latest', label: '최신순' },
  { value: 'views', label: '조회수순' },
  { value: 'comments', label: '댓글순' },
  { value: 'likes', label: '좋아요순' },
];

export const DEFAULT_COMMUNITY_POST_SORT: CommunityPostSortOption = 'latest';

export function normalizeCommunityPostSort(value: string | null): CommunityPostSortOption {
  const matched = COMMUNITY_POST_SORT_OPTIONS.find((option) => option.value === value);
  return matched?.value ?? DEFAULT_COMMUNITY_POST_SORT;
}
