import { useNavigate } from 'react-router';

import { CommunityPostCard } from '@/entities/community-post';
import { buildCommunityDetailPath } from '@/shared/constants';
import { ErrorState, Skeleton } from '@/shared/ui';

import { useCommunityBoard } from '../hooks/useCommunityBoard';
import { CommunityBoardEmptyState } from './CommunityBoardEmptyState';
import { CommunityCategoryTabs } from './CommunityCategoryTabs';
import { CommunitySearchBar } from './CommunitySearchBar';

const POST_GRID_CLASS = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3';
const POST_GRID_SKELETON_COUNT = 6;

export function CommunityBoardContainer() {
  const { query, category, posts, isLoading, isError, reload, setQuery, setCategory } =
    useCommunityBoard();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="text-left space-y-1">
        <span className="text-[10px] font-extrabold text-primary">YouthPick &gt; 커뮤니티</span>
        <h2 className="text-lg font-black text-slate-800">청년들의 이야기 공간</h2>
        <p className="text-xs text-slate-400">
          정책에 대한 질문과 후기, 소소한 이야기를 자유롭게 나눠보세요.
        </p>
      </div>

      <CommunitySearchBar query={query} onQueryChange={setQuery} />

      <CommunityCategoryTabs activeCategory={category} onCategoryChange={setCategory} />

      {isLoading && (
        <div className={POST_GRID_CLASS}>
          {Array.from({ length: POST_GRID_SKELETON_COUNT }, (_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: 순서가 바뀌지 않는 정적 로딩 플레이스홀더라 안정적인 id가 없다
            <Skeleton key={index} className="h-44" />
          ))}
        </div>
      )}

      {isError && <ErrorState title="게시글 목록을 불러오지 못했습니다" onRetry={() => reload()} />}

      {!isLoading &&
        !isError &&
        (posts.length > 0 ? (
          <div className={POST_GRID_CLASS}>
            {posts.map((post) => (
              <CommunityPostCard
                key={post.id}
                post={post}
                onSelect={(target) => navigate(buildCommunityDetailPath(target.id))}
              />
            ))}
          </div>
        ) : (
          <CommunityBoardEmptyState
            onResetFilters={() => {
              setQuery('');
              setCategory('전체');
            }}
          />
        ))}
    </div>
  );
}
