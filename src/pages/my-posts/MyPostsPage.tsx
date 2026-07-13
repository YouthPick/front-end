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
      emptyTitle="아직 작성한 게시글이 없습니다."
    />
  );
}
