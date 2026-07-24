import { useQuery } from '@tanstack/react-query';

import { fetchCommunityCommentCounts } from '../api/communityCommentApi';

export function useCommunityCommentCounts(postIds: string[]) {
  const { data: counts = {} } = useQuery({
    queryKey: ['community', 'comments', 'counts', postIds.slice().sort().join(',')],
    queryFn: () => fetchCommunityCommentCounts(postIds),
    enabled: postIds.length > 0,
    staleTime: 60_000,
  });

  return counts;
}
