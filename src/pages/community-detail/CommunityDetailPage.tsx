import { Link, Navigate, useParams } from 'react-router';

import { CommunityPostDetail, useCommunityPostQuery } from '@/entities/community-post';
import { usePolicyDetailStore } from '@/entities/policy';
import { CommentListContainer } from '@/features/community-comment';
import { useCommunityLike } from '@/features/community-like';
import { ROUTES } from '@/shared/constants';
import { ErrorState, Skeleton } from '@/shared/ui';

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
  const { isLiked, toggleLike } = useCommunityLike();
  const openPolicyDetail = usePolicyDetailStore((state) => state.openPolicyDetail);

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
            post={post}
            isLiked={isLiked(post.id)}
            onToggleLike={toggleLike}
            onViewAttachedPolicy={openPolicyDetail}
          />
          <CommentListContainer postId={post.id} />
        </>
      )}
    </div>
  );
}
