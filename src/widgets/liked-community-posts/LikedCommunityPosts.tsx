import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router';

import { CommunityPostPreviewList } from '@/entities/community-post';
import { useLikedCommunityPosts } from '@/features/community-like';
import { buildCommunityDetailPath, ROUTES } from '@/shared/constants';

export function LikedCommunityPosts() {
  const { likedPosts, isLoading, isError, refetch, toggleLike } = useLikedCommunityPosts();
  const navigate = useNavigate();

  return (
    <CommunityPostPreviewList
      title="좋아요한 게시글"
      posts={likedPosts}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
      emptyMessage="아직 좋아요한 게시글이 없습니다."
      onViewAll={() => navigate(ROUTES.myLikedPosts)}
      onSelectPost={(post) => navigate(buildCommunityDetailPath(post.id))}
      renderTrailing={(post) => (
        <button
          type="button"
          onClick={() => toggleLike(post.id)}
          aria-label="좋아요 취소"
          className="relative z-10 shrink-0 pl-2 text-rose-500"
        >
          <Heart className="h-3.5 w-3.5 fill-current" />
        </button>
      )}
    />
  );
}
