import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  adjustCommunityPostLikeCount,
  type CommunityPost,
  communityPostKeys,
} from '@/entities/community-post';
import { useToast } from '@/shared/ui';

import { fetchLikedCommunityPostIds, toggleCommunityLike } from '../api/communityLikeApi';

export const communityLikeKeys = {
  all: ['community-likes'] as const,
};

export function useCommunityLike() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const {
    data: likedPostIds = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: communityLikeKeys.all,
    queryFn: fetchLikedCommunityPostIds,
  });

  const likedPostIdSet = useMemo(() => new Set(likedPostIds), [likedPostIds]);

  const toggleMutation = useMutation({
    mutationFn: async (postId: string) => {
      const result = await toggleCommunityLike(postId);
      const updated = await adjustCommunityPostLikeCount(postId, result.liked ? 1 : -1);
      return { postId, updated };
    },
    onSuccess: ({ postId, updated }) => {
      queryClient.invalidateQueries({ queryKey: communityLikeKeys.all });
      // 좋아요 개수만 바뀌었으므로 전체 게시글 쿼리를 refetch하는 대신 캐시를 직접 patch한다.
      if (!updated) return;
      const likeCount = updated.likeCount;
      queryClient.setQueriesData<CommunityPost[] | CommunityPost | null>(
        { queryKey: communityPostKeys.all },
        (old) => {
          if (Array.isArray(old)) {
            return old.map((post) => (post.id === postId ? { ...post, likeCount } : post));
          }
          if (old && old.id === postId) {
            return { ...old, likeCount };
          }
          return old;
        },
      );
    },
    onError: () => {
      showToast('좋아요 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'warning');
    },
  });

  const isLiked = (postId: string) => likedPostIdSet.has(postId);

  return {
    likedPostIds,
    isLiked,
    toggleLike: (postId: string) => toggleMutation.mutate(postId),
    isLoading,
    isError,
    isToggling: toggleMutation.isPending,
    toggleError: toggleMutation.isError,
    refetch,
  };
}
