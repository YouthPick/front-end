import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
    mutationFn: toggleCommunityLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityLikeKeys.all });
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
