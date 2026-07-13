import { Paperclip, X } from 'lucide-react';
import { useState } from 'react';

import type {
  AdminAttachment,
  AdminCommunityComment,
  AdminCommunityPost,
} from '@/entities/community-post';
import { ConfirmDialog, Skeleton } from '@/shared/ui';
import { formatDateTime } from '@/shared/utils';

import { AdminCommunityCommentTree } from './AdminCommunityCommentTree';

interface AdminCommunityDetailModalProps {
  post: AdminCommunityPost | null;
  comments: AdminCommunityComment[];
  isCommentsLoading: boolean;
  attachments: AdminAttachment[];
  isAttachmentsLoading: boolean;
  onClose: () => void;
  onDeletePost: () => void;
  isDeletingPost: boolean;
  onDeleteComment: (commentId: string) => void;
  isDeletingComment: boolean;
}

function formatFileSize(bytes: number): string {
  return `${(bytes / 1024).toFixed(0)}KB`;
}

export function AdminCommunityDetailModal({
  post,
  comments,
  isCommentsLoading,
  attachments,
  isAttachmentsLoading,
  onClose,
  onDeletePost,
  isDeletingPost,
  onDeleteComment,
  isDeletingComment,
}: AdminCommunityDetailModalProps) {
  const [showDeletePostConfirm, setShowDeletePostConfirm] = useState(false);
  const [pendingDeleteCommentId, setPendingDeleteCommentId] = useState<string | null>(null);

  if (!post) return null;

  const isDeleted = post.deletedAt !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="게시글 상세"
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl text-left space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-black text-slate-800">게시글 상세</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block rounded px-1.5 py-0.5 text-[9px] font-black bg-primary/10 text-primary">
              {post.category}
            </span>
            {isDeleted && (
              <span className="inline-block rounded px-1.5 py-0.5 text-[9px] font-black bg-rose-50 text-rose-600">
                삭제됨
              </span>
            )}
          </div>
          <h4 className="mt-1.5 text-sm font-black text-slate-800">{post.title}</h4>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">{post.content}</p>
          <p className="mt-2 text-[10px] text-slate-400">
            {post.authorName} ({post.authorId}) · {formatDateTime(post.createdAt)} · 조회{' '}
            {post.viewCount.toLocaleString('ko-KR')}
          </p>
        </div>

        <div>
          <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
            첨부파일
          </span>
          {isAttachmentsLoading && <Skeleton className="h-8" />}
          {!isAttachmentsLoading && attachments.length === 0 && (
            <p className="text-xs text-slate-400">첨부파일이 없습니다.</p>
          )}
          {!isAttachmentsLoading && attachments.length > 0 && (
            <ul className="space-y-1">
              {attachments.map((attachment) => (
                <li
                  key={attachment.id}
                  className="flex items-center space-x-1.5 text-xs text-slate-600"
                >
                  <Paperclip className="h-3.5 w-3.5 text-slate-400" />
                  <span className="truncate">{attachment.fileKey}</span>
                  <span className="text-slate-400">({formatFileSize(attachment.fileSize)})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
            댓글
          </span>
          {isCommentsLoading ? (
            <div className="space-y-1.5">
              <Skeleton className="h-8" />
              <Skeleton className="h-8" />
            </div>
          ) : (
            <AdminCommunityCommentTree
              comments={comments}
              onDeleteComment={setPendingDeleteCommentId}
              isDeleting={isDeletingComment}
            />
          )}
        </div>

        <div className="flex justify-end border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => setShowDeletePostConfirm(true)}
            disabled={isDeletingPost || isDeleted}
            className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleted ? '삭제됨' : '게시글 삭제(soft delete)'}
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={showDeletePostConfirm}
        title="정말로 이 게시글을 삭제하시겠습니까?"
        description={
          <>
            <strong>{post.title}</strong> 게시글을 삭제(soft delete) 처리합니다. 삭제된 게시글은
            사용자 화면에 더 이상 노출되지 않습니다.
          </>
        }
        confirmLabel="확인, 삭제"
        cancelLabel="취소"
        onConfirm={() => {
          setShowDeletePostConfirm(false);
          onDeletePost();
        }}
        onCancel={() => setShowDeletePostConfirm(false)}
      />

      <ConfirmDialog
        open={pendingDeleteCommentId !== null}
        title="정말로 이 댓글을 삭제하시겠습니까?"
        description="삭제된 댓글은 사용자 화면에 더 이상 노출되지 않습니다."
        confirmLabel="확인, 삭제"
        cancelLabel="취소"
        onConfirm={() => {
          if (pendingDeleteCommentId) onDeleteComment(pendingDeleteCommentId);
          setPendingDeleteCommentId(null);
        }}
        onCancel={() => setPendingDeleteCommentId(null)}
      />
    </div>
  );
}
