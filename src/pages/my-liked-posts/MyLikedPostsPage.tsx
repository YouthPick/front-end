import { useLikedCommunityPosts } from '@/features/community-like';
import { useSeo } from '@/shared/hooks';
import { CommunityPostListPage } from '@/widgets/community-post-list-page';

export function MyLikedPostsPage() {
  useSeo({ title: '좋아요한 글', noindex: true });
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
      emptyTitle="좋아요한 글 모아보기는 준비 중입니다"
      emptyDescription="아직 좋아요 기준 게시글 조회를 지원하지 않아요. 서비스가 준비되면 여기에서 좋아요한 글을 확인할 수 있어요."
    />
  );
}
