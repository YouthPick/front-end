import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { adjustCommunityPostLikeCount, communityPostKeys } from '@/entities/community-post';

import { fetchLikedCommunityPostIds, toggleCommunityLike } from '../api/communityLikeApi';

export const communityLikeKeys = {
  all: ['community-likes'] as const,
};

export function useCommunityLike() {
  const queryClient = useQueryClient();

  const {
    data: likedPostIds = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: communityLikeKeys.all,
    queryFn: fetchLikedCommunityPostIds,
  });

  const toggleMutation = useMutation({
    mutationFn: async (postId: string) => {
      const result = await toggleCommunityLike(postId);
      await adjustCommunityPostLikeCount(postId, result.liked ? 1 : -1);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityLikeKeys.all });
      queryClient.invalidateQueries({ queryKey: communityPostKeys.all });
    },
  });

  const isLiked = (postId: string) => likedPostIds.includes(postId);

  return {
    likedPostIds,
    isLiked,
    toggleLike: (postId: string) => toggleMutation.mutate(postId),
    isLoading,
    isError,
    refetch,
  };
}
