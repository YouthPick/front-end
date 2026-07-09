import { Eye, MessageCircle } from 'lucide-react';

import type { CommunityPost } from '../model/communityPost.types';
import { CommunityCategoryBadge } from './CommunityCategoryBadge';

interface CommunityPostCardProps {
  post: CommunityPost;
  onSelect: (post: CommunityPost) => void;
}

export function CommunityPostCard({ post, onSelect }: CommunityPostCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(post)}
      aria-label={`${post.title} 게시글 보기`}
      className="w-full rounded-2xl border border-slate-200/60 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5">
          <CommunityCategoryBadge category={post.category} />
          <span className="text-[10px] font-bold text-slate-400">{post.authorName}</span>
          <span className="text-slate-200">·</span>
          <span className="text-[10px] font-bold text-slate-400">{post.createdAt}</span>
        </div>

        <h3 className="line-clamp-1 text-sm font-bold text-slate-800" title={post.title}>
          {post.title}
        </h3>
        <p className="line-clamp-2 min-h-9 text-[11px] leading-relaxed text-slate-400 font-medium">
          {post.content}
        </p>

        <div className="flex items-center gap-3 border-t border-slate-100/75 pt-3 text-[10px] font-bold text-slate-400">
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
    </button>
  );
}
