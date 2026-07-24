import type { CommunityPost } from '@/entities/community-post';

import { useCommunityLike } from './useCommunityLike';

// 마이페이지 미리보기 섹션과 좋아요한 글 전체 목록 페이지가 함께 쓰는 조회 로직.
//
// 좋아요 기준 게시글 조회 API가 백엔드에 아직 없다(좋아요 저장 자체가 mock).
// 이전에는 mock 게시글 전체를 받아 mock 좋아요 id로 걸렀지만, 커뮤니티 목록이
// 실서버(/v1/posts)로 전환되면서 실제 사용자와 무관한 mock 게시글이 노출되는
// 문제가 있어 mock 조회를 중단하고 빈 목록("준비 중" 안내)을 반환한다.
// 백엔드 API가 준비되면 이 훅의 조회 로직만 실서버 호출로 교체한다.
export function useLikedCommunityPosts() {
  const { toggleLike, isFallback } = useCommunityLike();

  const likedPosts: CommunityPost[] = [];

  return {
    likedPosts,
    isLoading: false,
    isError: false,
    refetch: () => {},
    toggleLike,
    isFallback,
  };
}
