import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router';
import {
  CommunityPostDetail,
  communityPostKeys,
  deleteCommunityPost,
  useCommunityPostQuery,
} from '@/entities/community-post';
import { usePolicyDetailQuery, usePolicyDetailStore } from '@/entities/policy';
import { useAuthStore } from '@/entities/user';
import { CommentListContainer, useCommunityComments } from '@/features/community-comment';
import { useCommunityLike } from '@/features/community-like';
import { buildCommunityEditPath, ROUTES } from '@/shared/constants';
import { ConfirmDialog, ErrorState, Skeleton, useToast } from '@/shared/ui';

export function CommunityDetailPage() {
  const { postId } = useParams<{ postId: string }>();

  if (!postId) {
    return <Navigate to={ROUTES.community} replace />;
  }

  return <CommunityDetailPageContent postId={postId} />;
}

interface CommunityDetailPageContentProps {
  postId: string;
}

function CommunityDetailPageContent({ postId }: CommunityDetailPageContentProps) {
  const { data: post, isLoading, isError, refetch } = useCommunityPostQuery(postId);
  // PostDetailResponse에는 policyId/policyTitle만 있고 category/deadline이 없어
  // 게시글 상세 응답만으로는 첨부 정책 카드를 완성할 수 없다 — 정책 상세를 따로 조회해 채운다.
  const { data: attachedPolicy } = usePolicyDetailQuery(post?.policyId ?? null);
  const { isLiked, toggleLike, isToggling } = useCommunityLike();
  const { data: comments } = useCommunityComments(postId);
  const user = useAuthStore((state) => state.user);
  const openPolicyDetail = usePolicyDetailStore((state) => state.openPolicyDetail);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteCommunityPost(postId),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: communityPostKeys.detail(postId) });
      queryClient.invalidateQueries({ queryKey: communityPostKeys.all });
      showToast('게시글을 삭제했습니다.', 'success');
      navigate(ROUTES.community, { replace: true });
    },
    onError: () => showToast('게시글 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'warning'),
  });

  const canManage = post !== undefined && post !== null && user?.id === post.authorId;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <Link
        to={ROUTES.community}
        className="inline-block text-[11px] font-bold text-slate-400 hover:text-primary"
      >
        &larr; 커뮤니티 목록으로
      </Link>

      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-24" />
        </div>
      )}

      {isError && <ErrorState title="게시글을 불러오지 못했습니다" onRetry={() => refetch()} />}

      {!isLoading && !isError && !post && (
        <ErrorState title="존재하지 않거나 삭제된 게시글입니다" />
      )}

      {!isLoading && !isError && post && (
        <>
          <CommunityPostDetail
            post={{
              ...post,
              commentCount: comments?.length ?? post.commentCount,
              attachedPolicy: attachedPolicy
                ? {
                    id: attachedPolicy.id,
                    title: attachedPolicy.title,
                    category: attachedPolicy.category,
                    deadline: attachedPolicy.deadline,
                  }
                : post.attachedPolicy,
            }}
            isLiked={isLiked(post.id)}
            onToggleLike={toggleLike}
            isLikeToggling={isToggling}
            onViewAttachedPolicy={openPolicyDetail}
            canManage={canManage}
            onEdit={() => navigate(buildCommunityEditPath(post.id))}
            onDelete={() => setIsDeleteDialogOpen(true)}
          />
          <CommentListContainer postId={post.id} />
        </>
      )}

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="게시글을 삭제하시겠습니까?"
        description="삭제한 게시글은 복구할 수 없습니다."
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setIsDeleteDialogOpen(false)}
        confirmDisabled={deleteMutation.isPending}
      />
    </div>
  );
}
