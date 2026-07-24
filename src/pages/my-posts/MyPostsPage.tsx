import { useMyCommunityPosts } from '@/features/community-my-posts';
import { CommunityPostListPage } from '@/widgets/community-post-list-page';

export function MyPostsPage() {
  const { posts, isLoading, isError, refetch } = useMyCommunityPosts();

  return (
    <CommunityPostListPage
      breadcrumb="YouthPick > 마이페이지 > 내가 작성한 글"
      title="내가 작성한 글"
      description="직접 작성한 게시글만 모아봤어요."
      posts={posts}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
      emptyTitle="내가 작성한 글 모아보기는 준비 중입니다"
      emptyDescription="아직 작성자 기준 게시글 조회를 지원하지 않아요. 서비스가 준비되면 여기에서 직접 작성한 글을 확인할 수 있어요."
    />
  );
}
