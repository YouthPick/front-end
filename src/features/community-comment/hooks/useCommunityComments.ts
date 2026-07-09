import { useQuery } from '@tanstack/react-query';

import { fetchCommunityComments } from '../api/communityCommentApi';
import { mapCommunityCommentDtosToComments } from '../model/communityCommentMapper';

export const communityCommentKeys = {
  byPost: (postId: string) => ['community-comments', postId] as const,
};

export function useCommunityComments(postId: string) {
  return useQuery({
    queryKey: communityCommentKeys.byPost(postId),
    queryFn: async () => mapCommunityCommentDtosToComments(await fetchCommunityComments(postId)),
  });
}
