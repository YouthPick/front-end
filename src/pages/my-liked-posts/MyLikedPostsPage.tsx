import { useLikedCommunityPosts } from '@/features/community-like';
import { CommunityPostListPage } from '@/widgets/community-post-list-page';

export function MyLikedPostsPage() {
  const { likedPosts, isLoading, isError, refetch } = useLikedCommunityPosts();

  return (
    <CommunityPostListPage
      breadcrumb="YouthPick > 마이페이지 > 좋아요한 글"
      title="좋아요한 글"
      description="좋아요를 누른 게시글만 모아봤어요."
      posts={likedPosts}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
      emptyTitle="아직 좋아요한 게시글이 없습니다."
    />
  );
}
