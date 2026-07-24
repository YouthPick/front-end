import { Paperclip } from 'lucide-react';
import type { ReactNode } from 'react';

import { ErrorState, Skeleton } from '@/shared/ui';
import { stripHtml } from '@/shared/utils';

import type { CommunityPost } from '../model/communityPost.types';
import { CommunityCategoryBadge } from './CommunityCategoryBadge';

const PREVIEW_COUNT = 5;

interface CommunityPostPreviewListProps {
  title: string;
  posts: CommunityPost[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  emptyMessage: string;
  onViewAll: () => void;
  onSelectPost: (post: CommunityPost) => void;
  renderTrailing: (post: CommunityPost) => ReactNode;
}

// 마이페이지의 "좋아요한 게시글"·"내가 작성한 글" 미리보기 섹션이 공유하는 shell.
// 두 섹션은 데이터 출처와 행 끝 콘텐츠(좋아요 취소 버튼 vs 작성일)만 다르다.
export function CommunityPostPreviewList({
  title,
  posts,
  isLoading,
  isError,
  onRetry,
  emptyMessage,
  onViewAll,
  onSelectPost,
  renderTrailing,
}: CommunityPostPreviewListProps) {
  const previewPosts = posts.slice(0, PREVIEW_COUNT);

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm text-left">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        <button
          type="button"
          onClick={onViewAll}
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
          <ErrorState title={`${title}을 불러오지 못했습니다`} onRetry={onRetry} />
        )}

        {!isLoading && !isError && previewPosts.length === 0 && (
          <p className="py-6 text-center text-xs text-slate-400">{emptyMessage}</p>
        )}

        {!isLoading && !isError && previewPosts.length > 0 && (
          <div className="divide-y divide-slate-100">
            {previewPosts.map((post) => (
              <div
                key={post.id}
                className="relative flex items-start justify-between gap-2 py-3 px-2 -mx-2 rounded-xl transition-colors hover:bg-slate-50/50"
              >
                <button
                  type="button"
                  onClick={() => onSelectPost(post)}
                  aria-label={`${post.title} 상세 보기`}
                  className="absolute inset-0 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <CommunityCategoryBadge category={post.category} />
                    {post.policyTitle && (
                      <span
                        className="flex min-w-0 items-center gap-1 rounded-md border border-primary/20 bg-primary/5 px-1.5 py-0.5 text-[10px] font-bold text-primary"
                        title={`첨부된 정책: ${post.policyTitle}`}
                      >
                        <Paperclip className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
                        <span className="max-w-20 truncate">{post.policyTitle}</span>
                      </span>
                    )}
                    <span className="truncate text-[11px] font-bold text-slate-700">
                      {post.title}
                    </span>
                  </div>
                  <p className="line-clamp-1 text-[10px] leading-relaxed text-slate-400 font-medium">
                    {stripHtml(post.content)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center">{renderTrailing(post)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
