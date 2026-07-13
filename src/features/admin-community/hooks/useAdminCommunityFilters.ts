import { useSearchParams } from 'react-router';

import { COMMUNITY_POST_CATEGORIES } from '@/entities/community-post';
import { useSubmittableUrlQuery } from '@/shared/hooks';

const DEFAULT_PAGE = 1;
export const ALL_CATEGORY_VALUE = 'ALL';

// URL에서 온 값은 신뢰할 수 없으므로 알 수 없는 값은 전체 조회(undefined)로 되돌린다.
function normalizeCategory(value: string | null): string | undefined {
  return COMMUNITY_POST_CATEGORIES.find((category) => category === value);
}

interface AdminCommunityFilterValues {
  category?: string;
  startDate?: string;
  endDate?: string;
}

// 카테고리·작성자·기간 필터와 페이지를 URL 쿼리스트링과 동기화한다.
// 작성자(authorId)의 draft/제출 동기화는 shared/hooks/useSubmittableUrlQuery를 재사용한다.
export function useAdminCommunityFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    query: authorId,
    draftQuery: draftAuthorId,
    setDraftQuery: setDraftAuthorId,
    submitQuery: submitAuthorId,
  } = useSubmittableUrlQuery('authorId');

  const category = normalizeCategory(searchParams.get('category'));
  const startDate = searchParams.get('startDate') ?? '';
  const endDate = searchParams.get('endDate') ?? '';
  const page = Number(searchParams.get('page')) || DEFAULT_PAGE;

  // 카테고리·기간 필터가 바뀌면 이전 페이지 번호가 더 이상 유효하지 않을 수 있으므로 항상 1페이지로 되돌린다.
  function applyFilters(next: AdminCommunityFilterValues) {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(next)) {
          if (!value || value === ALL_CATEGORY_VALUE) nextParams.delete(key);
          else nextParams.set(key, value);
        }
        nextParams.delete('page');
        return nextParams;
      },
      { replace: true },
    );
  }

  const setCategory = (value: string) => applyFilters({ category: value });
  const setDateRange = (range: { startDate?: string; endDate?: string }) => applyFilters(range);

  const setPage = (nextPage: number) => {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);
        if (nextPage <= DEFAULT_PAGE) nextParams.delete('page');
        else nextParams.set('page', String(nextPage));
        return nextParams;
      },
      { replace: true },
    );
  };

  const resetFilters = () => {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);
        nextParams.delete('category');
        nextParams.delete('authorId');
        nextParams.delete('startDate');
        nextParams.delete('endDate');
        nextParams.delete('page');
        return nextParams;
      },
      { replace: true },
    );
    setDraftAuthorId('');
  };

  return {
    category,
    setCategory,
    authorId,
    draftAuthorId,
    setDraftAuthorId,
    submitAuthorId,
    startDate,
    endDate,
    setDateRange,
    page,
    setPage,
    resetFilters,
  };
}
