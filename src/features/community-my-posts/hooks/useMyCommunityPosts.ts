import type { CommunityPost } from '@/entities/community-post';

// 마이페이지 미리보기 섹션과 내가 작성한 글 전체 목록 페이지가 함께 쓰는 조회 로직.
//
// 작성자 기준 게시글 조회 API가 백엔드에 아직 없다. 이전에는 mock 게시글 전체를
// 받아 authorId로 걸렀지만, 커뮤니티 목록이 실서버(/v1/posts)로 전환되면서 실제
// 사용자와 무관한 mock 게시글이 노출될 수 있어 mock 조회를 중단하고 빈 목록
// ("준비 중" 안내)을 반환한다. 백엔드 API가 준비되면 이 훅의 조회 로직만 실서버
// 호출로 교체한다.
export function useMyCommunityPosts() {
  const posts: CommunityPost[] = [];

  return {
    posts,
    isLoading: false,
    isError: false,
    refetch: () => {},
    // 실서버 API 부재로 실제 데이터를 보여주지 못하는 상태임을 UI에 알린다(rules §8).
    isFallback: true,
  };
}
