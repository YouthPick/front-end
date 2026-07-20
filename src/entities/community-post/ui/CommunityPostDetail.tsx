import DOMPurify from 'dompurify';
import { Eye, Heart, MessageCircle, Pencil, Trash2 } from 'lucide-react';

import type { CommunityPost } from '../model/communityPost.types';
import { AttachedPolicyPreview } from './AttachedPolicyPreview';
import { CommunityCategoryBadge } from './CommunityCategoryBadge';

interface CommunityPostDetailProps {
  post: CommunityPost;
  isLiked: boolean;
  onToggleLike: (postId: string) => void;
  onViewAttachedPolicy: (policyId: string) => void;
  canManage?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function CommunityPostDetail({
  post,
  isLiked,
  onToggleLike,
  onViewAttachedPolicy,
  canManage = false,
  onEdit,
  onDelete,
}: CommunityPostDetailProps) {
  return (
    <article className="space-y-4 rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
      <div className="space-y-2.5">
        <CommunityCategoryBadge category={post.category} />
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-lg font-black text-slate-800">{post.title}</h1>
          <div className="flex shrink-0 items-center gap-1">
            {canManage && (
              <>
                <button
                  type="button"
                  onClick={onEdit}
                  aria-label="게시글 수정"
                  className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onDelete}
                  aria-label="게시글 삭제"
                  className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => onToggleLike(post.id)}
              aria-pressed={isLiked}
              aria-label={isLiked ? '좋아요 취소' : '좋아요'}
              className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold transition-colors ${
                isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{post.likeCount}</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400">
          <span className="text-slate-600">{post.authorName}</span>
          <span className="text-slate-200">·</span>
          <span>{post.createdAt}</span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" aria-hidden="true" />
            {post.viewCount}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" aria-hidden="true" />
            {post.commentCount}
          </span>
        </div>
      </div>

      <div
        className="text-xs leading-relaxed text-slate-700 border-t border-slate-100/75 pt-4 wysiwyg-content"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: DOMPurify로 XSS 방지 후 렌더링
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
      />

      {post.attachedPolicy && (
        <AttachedPolicyPreview policy={post.attachedPolicy} onView={onViewAttachedPolicy} />
      )}
    </article>
  );
}
