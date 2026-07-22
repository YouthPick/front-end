import { useNavigate } from 'react-router';

import { type CommunityPost, CommunityPostCard } from '@/entities/community-post';
import { useCommunityCommentCounts } from '@/features/community-comment';
import { useCommunityLike } from '@/features/community-like';
import { buildCommunityDetailPath } from '@/shared/constants';

export const COMMUNITY_POST_GRID_CLASS = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3';
export const COMMUNITY_POST_GRID_SKELETON_COUNT = 6;

interface CommunityPostGridProps {
  posts: CommunityPost[];
  className?: string;
}

// 커뮤니티 게시글 카드에 좋아요·상세 이동을 배선하는 조합 블록
export function CommunityPostGrid({
  posts,
  className = COMMUNITY_POST_GRID_CLASS,
}: CommunityPostGridProps) {
  const navigate = useNavigate();
  const { isLiked, toggleLike, isToggling } = useCommunityLike();
  const commentCounts = useCommunityCommentCounts(posts.map((post) => post.id));

  return (
    <ul className={`list-none ${className}`}>
      {posts.map((post) => (
        <li key={post.id}>
          <CommunityPostCard
            post={{ ...post, commentCount: commentCounts[post.id] ?? post.commentCount }}
            onSelect={(target) => navigate(buildCommunityDetailPath(target.id))}
            isLiked={isLiked(post.id)}
            onToggleLike={toggleLike}
            isLikeToggling={isToggling}
          />
        </li>
      ))}
    </ul>
  );
}
