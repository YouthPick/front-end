import type { AdminCommunityComment } from '@/entities/community-post';
import { formatDateTime } from '@/shared/utils';

// Tailwind 표준 spacing 스케일(ml-4=1rem 단위)로 답글 깊이를 표현한다. 이후 깊이는 더 이상 들여쓰지 않는다.
const INDENT_CLASS_BY_DEPTH = ['ml-0', 'ml-4', 'ml-8', 'ml-12', 'ml-16'];

function getIndentClass(depth: number): string {
  return INDENT_CLASS_BY_DEPTH[Math.min(depth, INDENT_CLASS_BY_DEPTH.length - 1)];
}

interface AdminCommunityCommentTreeProps {
  comments: AdminCommunityComment[];
  onDeleteComment: (commentId: string) => void;
  isDeleting: boolean;
}

function CommentNode({
  comment,
  childrenByParentId,
  depth,
  onDeleteComment,
  isDeleting,
}: {
  comment: AdminCommunityComment;
  childrenByParentId: Map<string | null, AdminCommunityComment[]>;
  depth: number;
  onDeleteComment: (commentId: string) => void;
  isDeleting: boolean;
}) {
  const isDeleted = comment.deletedAt !== null;
  const replies = childrenByParentId.get(comment.id) ?? [];

  return (
    <li className={getIndentClass(depth)}>
      <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-slate-700">{comment.authorName}</span>
            <span className="ml-1.5 text-[10px] text-slate-400">
              {formatDateTime(comment.createdAt)}
            </span>
            <p
              className={`mt-0.5 text-xs ${isDeleted ? 'text-slate-400 italic' : 'text-slate-600'}`}
            >
              {isDeleted ? '삭제된 댓글입니다.' : comment.content}
            </p>
          </div>
          {!isDeleted && (
            <button
              type="button"
              onClick={() => onDeleteComment(comment.id)}
              disabled={isDeleting}
              className="shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold text-rose-500 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              삭제
            </button>
          )}
        </div>
      </div>

      {replies.length > 0 && (
        <ul className="mt-1.5 space-y-1.5">
          {replies.map((reply) => (
            <CommentNode
              key={reply.id}
              comment={reply}
              childrenByParentId={childrenByParentId}
              depth={depth + 1}
              onDeleteComment={onDeleteComment}
              isDeleting={isDeleting}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function AdminCommunityCommentTree({
  comments,
  onDeleteComment,
  isDeleting,
}: AdminCommunityCommentTreeProps) {
  if (comments.length === 0) {
    return <p className="text-xs text-slate-400">작성된 댓글이 없습니다.</p>;
  }

  const childrenByParentId = new Map<string | null, AdminCommunityComment[]>();
  for (const comment of comments) {
    const siblings = childrenByParentId.get(comment.parentCommentId) ?? [];
    siblings.push(comment);
    childrenByParentId.set(comment.parentCommentId, siblings);
  }

  const topLevelComments = childrenByParentId.get(null) ?? [];

  return (
    <ul className="space-y-1.5">
      {topLevelComments.map((comment) => (
        <CommentNode
          key={comment.id}
          comment={comment}
          childrenByParentId={childrenByParentId}
          depth={0}
          onDeleteComment={onDeleteComment}
          isDeleting={isDeleting}
        />
      ))}
    </ul>
  );
}
