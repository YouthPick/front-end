import { useAdminCommunity } from '../hooks/useAdminCommunity';
import { useAdminCommunityDetail } from '../hooks/useAdminCommunityDetail';
import { AdminCommunityPresenter } from './AdminCommunityPresenter';

export function AdminCommunityContainer() {
  const {
    posts,
    page,
    pageSize,
    totalCount,
    isLoading,
    isError,
    reload,
    category,
    onCategoryChange,
    authorId,
    onAuthorIdChange,
    onAuthorIdSubmit,
    startDate,
    endDate,
    onDateRangeChange,
    onPageChange,
    onReset,
    selectedPostId,
    onSelectPost,
    onCloseDetail,
  } = useAdminCommunity();

  const selectedPost = posts.find((post) => post.id === selectedPostId) ?? null;

  const {
    comments,
    isCommentsLoading,
    attachments,
    isAttachmentsLoading,
    deletePost,
    isDeletingPost,
    deleteComment,
    isDeletingComment,
  } = useAdminCommunityDetail(selectedPostId);

  return (
    <AdminCommunityPresenter
      posts={posts}
      page={page}
      pageSize={pageSize}
      totalCount={totalCount}
      isLoading={isLoading}
      isError={isError}
      onReload={reload}
      onPageChange={onPageChange}
      category={category}
      onCategoryChange={onCategoryChange}
      authorId={authorId}
      onAuthorIdChange={onAuthorIdChange}
      onAuthorIdSubmit={onAuthorIdSubmit}
      startDate={startDate}
      endDate={endDate}
      onDateRangeChange={onDateRangeChange}
      onReset={onReset}
      selectedPost={selectedPost}
      comments={comments}
      isCommentsLoading={isCommentsLoading}
      attachments={attachments}
      isAttachmentsLoading={isAttachmentsLoading}
      onSelectPost={(post) => onSelectPost(post.id)}
      onCloseDetail={onCloseDetail}
      onDeletePost={deletePost}
      isDeletingPost={isDeletingPost}
      onDeleteComment={deleteComment}
      isDeletingComment={isDeletingComment}
    />
  );
}
