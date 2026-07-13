import type { CommunityPost } from '@/entities/community-post';
import { EmptyState, ErrorState, Skeleton } from '@/shared/ui';
import {
  COMMUNITY_POST_GRID_CLASS,
  COMMUNITY_POST_GRID_SKELETON_COUNT,
  CommunityPostGrid,
} from '@/widgets/community-post-grid';

interface CommunityPostListPageProps {
  breadcrumb: string;
  title: string;
  description: string;
  posts: CommunityPost[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  emptyTitle: string;
}

// 좋아요한 글 / 내가 작성한 글 등 "내 게시글 모음" 성격의 전용 페이지가 공유하는 shell.
// 카드 목록 자체는 커뮤니티 목록과 동일한 CommunityPostGrid를 재사용한다.
export function CommunityPostListPage({
  breadcrumb,
  title,
  description,
  posts,
  isLoading,
  isError,
  onRetry,
  emptyTitle,
}: CommunityPostListPageProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="text-left space-y-1">
        <span className="text-[10px] font-extrabold text-primary">{breadcrumb}</span>
        <h2 className="text-lg font-black text-slate-800">{title}</h2>
        <p className="text-xs text-slate-400">{description}</p>
      </div>

      {isLoading && (
        <div className={COMMUNITY_POST_GRID_CLASS}>
          {Array.from({ length: COMMUNITY_POST_GRID_SKELETON_COUNT }, (_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: 순서가 바뀌지 않는 정적 로딩 플레이스홀더라 안정적인 id가 없다
            <Skeleton key={index} className="h-44" />
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <ErrorState title="게시글 목록을 불러오지 못했습니다" onRetry={onRetry} />
      )}

      {!isLoading &&
        !isError &&
        (posts.length > 0 ? (
          <CommunityPostGrid posts={posts} />
        ) : (
          <EmptyState title={emptyTitle} />
        ))}
    </div>
  );
}
