import { Eye, Heart, MessageCircle, Paperclip } from 'lucide-react';
import { stripHtml } from '@/shared/utils';
import type { CommunityPost } from '../model/communityPost.types';
import { CommunityCategoryBadge } from './CommunityCategoryBadge';

interface CommunityPostCardProps {
  post: CommunityPost;
  onSelect: (post: CommunityPost) => void;
  isLiked: boolean;
  onToggleLike: (postId: string) => void;
  /** 좋아요 토글 요청 진행 중 여부. true면 하트 버튼을 비활성화해 중복 클릭을 막는다. */
  isLikeToggling?: boolean;
}

export function CommunityPostCard({
  post,
  onSelect,
  isLiked,
  onToggleLike,
  isLikeToggling = false,
}: CommunityPostCardProps) {
  return (
    <article className="relative flex flex-col justify-between rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-primary/40">
      {/* 카드 전체를 덮는 상세 이동 버튼. 좋아요 버튼은 z-10으로 위에 올려 독립 동작시킨다. */}
      <button
        type="button"
        onClick={() => onSelect(post)}
        aria-label={`${post.title} 게시글 보기`}
        title={post.title}
        className="absolute inset-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />

      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5">
          <CommunityCategoryBadge category={post.category} />
          {post.attachedPolicy && (
            <span
              className="flex items-center gap-0.5 rounded-md border border-primary/20 bg-primary/5 px-1.5 py-0.5 text-[10px] font-bold text-primary"
              title={`첨부된 정책: ${post.attachedPolicy.title}`}
            >
              <Paperclip className="h-2.5 w-2.5" aria-hidden="true" />
              정책첨부
            </span>
          )}
          <span className="text-[10px] font-bold text-slate-400">{post.authorName}</span>
          <span className="text-slate-200">·</span>
          <span className="text-[10px] font-bold text-slate-400">{post.createdAt}</span>
        </div>

        <h3 className="line-clamp-1 text-sm font-bold text-slate-800" title={post.title}>
          {post.title}
        </h3>
        <p className="line-clamp-2 min-h-9 text-[11px] leading-relaxed text-slate-400 font-medium">
          {stripHtml(post.content)}
        </p>

        <div className="flex items-center justify-between border-t border-slate-100/75 pt-3 text-[10px] font-bold text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" aria-hidden="true" />
              {post.viewCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" aria-hidden="true" />
              {post.commentCount}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onToggleLike(post.id)}
            disabled={isLikeToggling}
            aria-disabled={isLikeToggling}
            aria-pressed={isLiked}
            aria-label={isLiked ? '좋아요 취소' : '좋아요'}
            className={`relative z-10 flex items-center gap-1 rounded-md px-1.5 py-0.5 transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{post.likeCount}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
