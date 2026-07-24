// 댓글순/좋아요순은 뺐다: Post 엔티티에 댓글수·좋아요수 컬럼이 없고(백엔드 집계 불가),
// 좋아요는 아직 백엔드에 저장되지도 않는 완전 로컬 mock이라 실제 정렬 근거가 없다.
export type CommunityPostSortOption = 'latest' | 'views';

export const COMMUNITY_POST_SORT_OPTIONS: readonly {
  value: CommunityPostSortOption;
  label: string;
}[] = [
  { value: 'latest', label: '최신순' },
  { value: 'views', label: '조회수순' },
];

export const DEFAULT_COMMUNITY_POST_SORT: CommunityPostSortOption = 'latest';

export function normalizeCommunityPostSort(value: string | null): CommunityPostSortOption {
  const matched = COMMUNITY_POST_SORT_OPTIONS.find((option) => option.value === value);
  return matched?.value ?? DEFAULT_COMMUNITY_POST_SORT;
}
