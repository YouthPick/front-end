import { Eye, MessageCircle } from 'lucide-react';

import type { CommunityPost } from '../model/communityPost.types';
import { CommunityCategoryBadge } from './CommunityCategoryBadge';

interface CommunityPostDetailProps {
  post: CommunityPost;
}

export function CommunityPostDetail({ post }: CommunityPostDetailProps) {
  return (
    <article className="space-y-4 rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
      <div className="space-y-2.5">
        <CommunityCategoryBadge category={post.category} />
        <h1 className="text-lg font-black text-slate-800">{post.title}</h1>
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
