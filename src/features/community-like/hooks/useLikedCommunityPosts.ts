import { useCommunityPostSearchQuery } from '@/entities/community-post';

import { useCommunityLike } from './useCommunityLike';

// 마이페이지 미리보기 섹션과 좋아요한 글 전체 목록 페이지가 함께 쓰는 조회 로직.
export function useLikedCommunityPosts() {
  const {
    likedPostIds,
    isLoading: isLikesLoading,
    isError: isLikesError,
    refetch: refetchLikes,
    toggleLike,
  } = useCommunityLike();
  const {
    data: posts = [],
    isLoading: isPostsLoading,
    isError: isPostsError,
    refetch: refetchPosts,
  } = useCommunityPostSearchQuery({});

  const isLoading = isLikesLoading || isPostsLoading;
  const isError = isLikesError || isPostsError;
  const likedPosts = posts.filter((post) => likedPostIds.includes(post.id));

  const refetch = () => {
    if (isLikesError) refetchLikes();
    if (isPostsError) refetchPosts();
  };

  return { likedPosts, isLoading, isError, refetch, toggleLike };
}
