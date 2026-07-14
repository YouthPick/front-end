import type { ColumnDef } from '@tanstack/react-table';

import type {
  AdminAttachment,
  AdminCommunityComment,
  AdminCommunityPost,
} from '@/entities/community-post';
import { DataTable } from '@/shared/ui';

import { AdminCommunityDetailModal } from './AdminCommunityDetailModal';
import { AdminCommunityFilters } from './AdminCommunityFilters';

interface AdminCommunityPresenterProps {
  posts: AdminCommunityPost[];
  page: number;
  pageSize: number;
  totalCount: number;
  isLoading: boolean;
  isError: boolean;
  onReload: () => void;
  onPageChange: (page: number) => void;
  category: string | undefined;
  onCategoryChange: (value: string) => void;
  authorId: string;
  onAuthorIdChange: (value: string) => void;
  onAuthorIdSubmit: () => void;
  startDate: string;
  endDate: string;
  onDateRangeChange: (range: { startDate?: string; endDate?: string }) => void;
  onReset: () => void;
  selectedPost: AdminCommunityPost | null;
  comments: AdminCommunityComment[];
  isCommentsLoading: boolean;
  isCommentsError: boolean;
  onReloadComments: () => void;
  attachments: AdminAttachment[];
  isAttachmentsLoading: boolean;
  isAttachmentsError: boolean;
  onReloadAttachments: () => void;
  onSelectPost: (post: AdminCommunityPost) => void;
  onCloseDetail: () => void;
  onDeletePost: () => void;
  isDeletingPost: boolean;
  onDeleteComment: (commentId: string) => void;
  isDeletingComment: boolean;
}

export function AdminCommunityPresenter({
  posts,
  page,
  pageSize,
  totalCount,
  isLoading,
  isError,
  onReload,
  onPageChange,
  category,
  onCategoryChange,
  authorId,
  onAuthorIdChange,
  onAuthorIdSubmit,
  startDate,
  endDate,
  onDateRangeChange,
  onReset,
  selectedPost,
  comments,
  isCommentsLoading,
  isCommentsError,
  onReloadComments,
  attachments,
  isAttachmentsLoading,
  isAttachmentsError,
  onReloadAttachments,
  onSelectPost,
  onCloseDetail,
  onDeletePost,
  isDeletingPost,
  onDeleteComment,
  isDeletingComment,
}: AdminCommunityPresenterProps) {
  const columns: ColumnDef<AdminCommunityPost>[] = [
    {
      accessorKey: 'title',
      header: '제목',
      cell: ({ getValue }) => (
        <span
          className="block max-w-[220px] truncate font-bold text-slate-700"
          title={getValue<string>()}
        >
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: 'category',
      header: '카테고리',
    },
    {
      accessorKey: 'authorName',
      header: '작성자',
    },
    {
      accessorKey: 'createdAt',
      header: '작성일',
    },
    {
      id: 'status',
      header: '상태',
      cell: ({ row }) =>
        row.original.deletedAt !== null ? (
          <span className="inline-block rounded px-1.5 py-0.5 text-[9px] font-black bg-rose-50 text-rose-600">
            삭제됨
          </span>
        ) : (
          <span className="inline-block rounded px-1.5 py-0.5 text-[9px] font-black bg-emerald-50 text-emerald-600">
            게시중
          </span>
        ),
    },
    {
      id: 'detail',
      header: '',
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onSelectPost(row.original)}
          className="rounded-lg px-2 py-1 text-[10px] font-bold text-primary hover:bg-primary/5"
        >
          상세보기
        </button>
      ),
    },
  ];

  return (
    <>
      <DataTable
        title="커뮤니티 관리"
        columns={columns}
        data={posts}
        getRowId={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        errorTitle="게시글 목록을 불러오지 못했습니다"
        onRetry={onReload}
        emptyIcon="🔍"
        emptyTitle="조회된 게시글이 없습니다"
        emptyDescription="검색 조건을 변경해 다시 시도해 주세요."
        toolbar={
          <AdminCommunityFilters
            category={category}
            onCategoryChange={onCategoryChange}
            authorId={authorId}
            onAuthorIdChange={onAuthorIdChange}
            onAuthorIdSubmit={onAuthorIdSubmit}
            startDate={startDate}
            endDate={endDate}
            onDateRangeChange={onDateRangeChange}
            onReset={onReset}
          />
        }
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={onPageChange}
      />

      <AdminCommunityDetailModal
        post={selectedPost}
        comments={comments}
        isCommentsLoading={isCommentsLoading}
        isCommentsError={isCommentsError}
        onReloadComments={onReloadComments}
        attachments={attachments}
        isAttachmentsLoading={isAttachmentsLoading}
        isAttachmentsError={isAttachmentsError}
        onReloadAttachments={onReloadAttachments}
        onClose={onCloseDetail}
        onDeletePost={onDeletePost}
        isDeletingPost={isDeletingPost}
        onDeleteComment={onDeleteComment}
        isDeletingComment={isDeletingComment}
      />
    </>
  );
}
