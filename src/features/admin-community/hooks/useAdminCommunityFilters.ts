import { COMMUNITY_POST_CATEGORIES } from '@/entities/community-post';
import { useSubmittableUrlQuery, useUrlFilters } from '@/shared/hooks';

export const ALL_CATEGORY_VALUE = 'ALL';

function normalizeCategory(value: string | null): string | undefined {
  return COMMUNITY_POST_CATEGORIES.find((category) => category === value);
}

function normalizeDate(value: string | null): string {
  return value ?? '';
}

type AdminCommunityFilterValues = {
  category: string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
};

// 카테고리·작성자·기간 필터와 페이지를 URL 쿼리스트링과 동기화한다.
// 작성자(authorId)의 draft/제출 동기화는 shared/hooks/useSubmittableUrlQuery를 재사용한다.
export function useAdminCommunityFilters() {
  const {
    query: authorId,
    draftQuery: draftAuthorId,
    setDraftQuery: setDraftAuthorId,
    submitQuery: submitAuthorId,
  } = useSubmittableUrlQuery('authorId');

  const { filters, page, setFilter, applyFilters, setPage, resetFilters } =
    useUrlFilters<AdminCommunityFilterValues>({
      keys: ['category', 'startDate', 'endDate'],
      normalizers: {
        category: normalizeCategory,
        startDate: normalizeDate,
        endDate: normalizeDate,
      },
    });

  const setDateRange = (range: { startDate?: string; endDate?: string }) => {
    applyFilters(range as Partial<AdminCommunityFilterValues>);
  };

  const handleResetFilters = () => {
    resetFilters();
    setDraftAuthorId('');
  };

  return {
    category: filters.category,
    setCategory: (val: string) => setFilter('category', val),
    authorId,
    draftAuthorId,
    setDraftAuthorId,
    submitAuthorId,
    startDate: filters.startDate ?? '',
    endDate: filters.endDate ?? '',
    setDateRange,
    page,
    setPage,
    resetFilters: handleResetFilters,
  };
}
