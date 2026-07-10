import { useQueries } from '@tanstack/react-query';

import { fetchCommunityComments } from '../api/communityCommentApi';
import { mapCommunityCommentDtosToComments } from '../model/communityCommentMapper';
import { communityCommentKeys } from './useCommunityComments';

// 게시글 목록·상세에서 댓글 수를 실제 개수(대댓글 포함)로 보여주기 위한 일괄 조회.
// useCommunityComments와 동일한 queryKey를 써서 상세 화면 진입 시 캐시를 공유한다.
export function useCommunityCommentCounts(postIds: string[]) {
  const results = useQueries({
    queries: postIds.map((postId) => ({
      queryKey: communityCommentKeys.byPost(postId),
      queryFn: async () => mapCommunityCommentDtosToComments(await fetchCommunityComments(postId)),
    })),
  });

  return postIds.reduce<Record<string, number>>((counts, postId, index) => {
    const count = results[index]?.data?.length;
    if (count !== undefined) counts[postId] = count;
    return counts;
  }, {});
}
