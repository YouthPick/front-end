import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router';

import { CommunityCategoryBadge, useCommunityPostSearchQuery } from '@/entities/community-post';
import { useCommunityLike } from '@/features/community-like';
import { buildCommunityDetailPath } from '@/shared/constants';
import { Skeleton } from '@/shared/ui';

export function LikedCommunityPosts() {
  const { likedPostIds, isLoading: isLikesLoading, toggleLike } = useCommunityLike();
  const { data: posts = [], isLoading: isPostsLoading } = useCommunityPostSearchQuery({});
  const navigate = useNavigate();

  const isLoading = isLikesLoading || isPostsLoading;
  const likedPosts = posts.filter((post) => likedPostIds.includes(post.id));

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm text-left">
      <h3 className="text-sm font-bold text-slate-800">좋아요한 게시글</h3>

      <div className="mt-4 divide-y divide-slate-100">
        {isLoading && (
          <div className="space-y-2 py-2">
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
          </div>
        )}

        {!isLoading && likedPosts.length === 0 && (
          <p className="py-6 text-center text-xs text-slate-400">
            아직 좋아요한 게시글이 없습니다.
          </p>
        )}

        {likedPosts.map((post) => (
          <div
            key={post.id}
            className="relative flex items-center justify-between py-3 px-2 -mx-2 rounded-xl transition-colors hover:bg-slate-50/50"
          >
            <button
              type="button"
              onClick={() => navigate(buildCommunityDetailPath(post.id))}
              aria-label={`${post.title} 상세 보기`}
              className="absolute inset-0 rounded-xl focus:outline-none"
            />
            <div className="flex items-center space-x-2.5 min-w-0 flex-1">
              <CommunityCategoryBadge category={post.category} />
              <span className="truncate text-[11px] font-bold text-slate-700">{post.title}</span>
            </div>
            <button
              type="button"
              onClick={() => toggleLike(post.id)}
              aria-label="좋아요 취소"
              className="relative z-10 shrink-0 pl-2 text-rose-500"
            >
              <Heart className="h-3.5 w-3.5 fill-current" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
