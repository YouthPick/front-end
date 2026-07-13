import { useNavigate } from 'react-router';

import { CommunityCategoryBadge } from '@/entities/community-post';
import { useMyCommunityPosts } from '@/features/community-my-posts';
import { buildCommunityDetailPath, ROUTES } from '@/shared/constants';
import { ErrorState, Skeleton } from '@/shared/ui';

const PREVIEW_COUNT = 5;

export function MyCommunityPosts() {
  const { posts, isLoading, isError, refetch } = useMyCommunityPosts();
  const navigate = useNavigate();

  const previewPosts = posts.slice(0, PREVIEW_COUNT);

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm text-left">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">내가 작성한 글</h3>
        <button
          type="button"
          onClick={() => navigate(ROUTES.myPosts)}
          className="text-xs font-bold text-slate-400 hover:text-slate-700"
        >
          전체보기
        </button>
      </div>

      <div className="mt-4">
        {isLoading && (
          <div className="space-y-2 py-2">
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
          </div>
        )}

        {!isLoading && isError && (
          <ErrorState title="내가 작성한 게시글을 불러오지 못했습니다" onRetry={refetch} />
        )}

        {!isLoading && !isError && previewPosts.length === 0 && (
          <p className="py-6 text-center text-xs text-slate-400">아직 작성한 게시글이 없습니다.</p>
        )}

        {!isLoading && !isError && previewPosts.length > 0 && (
          <div className="divide-y divide-slate-100">
            {previewPosts.map((post) => (
              <div
                key={post.id}
                className="relative flex items-center justify-between py-3 px-2 -mx-2 rounded-xl transition-colors hover:bg-slate-50/50"
              >
                <button
                  type="button"
                  onClick={() => navigate(buildCommunityDetailPath(post.id))}
                  aria-label={`${post.title} 상세 보기`}
                  className="absolute inset-0 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
                <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                  <CommunityCategoryBadge category={post.category} />
                  <span className="truncate text-[11px] font-bold text-slate-700">
                    {post.title}
                  </span>
                </div>
                <span className="relative z-10 shrink-0 pl-2 text-[10px] font-bold text-slate-400">
                  {post.createdAt}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
