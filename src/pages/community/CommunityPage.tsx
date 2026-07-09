import { Link } from 'react-router';

import {
  CommunityBoardEmptyState,
  CommunityBoardSortSelect,
  CommunityCategoryTabs,
  CommunitySearchBar,
  DEFAULT_CATEGORY_VALUE,
  useCommunityBoard,
} from '@/features/community-board';
import { ROUTES } from '@/shared/constants';
import { ErrorState, Skeleton } from '@/shared/ui';
import {
  COMMUNITY_POST_GRID_CLASS,
  COMMUNITY_POST_GRID_SKELETON_COUNT,
  CommunityPostGrid,
} from '@/widgets/community-post-grid';

export function CommunityPage() {
  const {
    query,
    category,
    sort,
    posts,
    isLoading,
    isError,
    reload,
    setQuery,
    setCategory,
    setSort,
  } = useCommunityBoard();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="text-left space-y-1">
          <span className="text-[10px] font-extrabold text-primary">YouthPick &gt; 커뮤니티</span>
          <h2 className="text-lg font-black text-slate-800">청년들의 이야기 공간</h2>
          <p className="text-xs text-slate-400">
            정책에 대한 질문과 후기, 소소한 이야기를 자유롭게 나눠보세요.
          </p>
        </div>
        <Link
          to={ROUTES.communityWrite}
          className="shrink-0 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white transition-all hover:brightness-105"
        >
          글쓰기
        </Link>
      </div>

      <CommunitySearchBar query={query} onQueryChange={setQuery} />

      <div className="flex items-center justify-between gap-2">
        <CommunityCategoryTabs activeCategory={category} onCategoryChange={setCategory} />
        <CommunityBoardSortSelect sort={sort} onSortChange={setSort} />
      </div>

      {isLoading && (
        <div className={COMMUNITY_POST_GRID_CLASS}>
          {Array.from({ length: COMMUNITY_POST_GRID_SKELETON_COUNT }, (_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: 순서가 바뀌지 않는 정적 로딩 플레이스홀더라 안정적인 id가 없다
            <Skeleton key={index} className="h-44" />
          ))}
        </div>
      )}

      {isError && <ErrorState title="게시글 목록을 불러오지 못했습니다" onRetry={() => reload()} />}

      {!isLoading &&
        !isError &&
        (posts.length > 0 ? (
          <CommunityPostGrid posts={posts} />
        ) : (
          <CommunityBoardEmptyState
            onResetFilters={() => {
              setQuery('');
              setCategory(DEFAULT_CATEGORY_VALUE);
            }}
          />
        ))}
    </div>
  );
}
