import { Eye, Heart, MessageCircle } from 'lucide-react';

import type { CommunityPost } from '../model/communityPost.types';
import { CommunityCategoryBadge } from './CommunityCategoryBadge';

interface CommunityPostDetailProps {
  post: CommunityPost;
  isLiked: boolean;
  onToggleLike: (postId: string) => void;
}

export function CommunityPostDetail({ post, isLiked, onToggleLike }: CommunityPostDetailProps) {
  return (
    <article className="space-y-4 rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
      <div className="space-y-2.5">
        <CommunityCategoryBadge category={post.category} />
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-lg font-black text-slate-800">{post.title}</h1>
          <button
            type="button"
            onClick={() => onToggleLike(post.id)}
            aria-pressed={isLiked}
            aria-label="좋아요"
            className={`flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold transition-colors ${
              isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{post.likeCount}</span>
          </button>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400">
          <span className="text-slate-600">{post.authorName}</span>
          <span className="text-slate-200">·</span>
          <span>{post.createdAt}</span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {post.viewCount}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            {post.commentCount}
          </span>
        </div>
      </div>

      <p className="whitespace-pre-line text-xs leading-relaxed text-slate-700 border-t border-slate-100/75 pt-4">
        {post.content}
      </p>
    </article>
  );
}
