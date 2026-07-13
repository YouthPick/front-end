import { useCommunityPostSearchQuery } from '@/entities/community-post';
import { useAuthStore } from '@/entities/user';

// 마이페이지 미리보기 섹션과 내가 작성한 글 전체 목록 페이지가 함께 쓰는 조회 로직.
export function useMyCommunityPosts() {
  const userId = useAuthStore((state) => state.user?.id);
  const {
    data: posts = [],
    isLoading,
    isError,
    refetch,
  } = useCommunityPostSearchQuery({ authorId: userId ?? '' });

  return { posts, isLoading, isError, refetch };
}
