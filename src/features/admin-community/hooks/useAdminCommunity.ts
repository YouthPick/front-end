import { useState } from 'react';

import { useAdminCommunityPostsQuery } from '@/entities/community-post';
import { DEFAULT_ADMIN_PAGE_SIZE } from '@/shared/constants';

import { useAdminCommunityFilters } from './useAdminCommunityFilters';

// 관리자 커뮤니티 목록 화면 use case: URL 필터 상태 + 서버(mock) 조회 + 상세보기 선택을 묶는다.
export function useAdminCommunity() {
  const {
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
  } = useAdminCommunityFilters();

  const {
    data,
    isLoading,
    isError,
    refetch: reload,
  } = useAdminCommunityPostsQuery({
    page,
    pageSize: DEFAULT_ADMIN_PAGE_SIZE,
    category,
    authorId: authorId || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  return {
    posts: data?.items ?? [],
    page: data?.page ?? page,
    pageSize: DEFAULT_ADMIN_PAGE_SIZE,
    totalCount: data?.totalCount ?? 0,
    isLoading,
    isError,
    reload,
    category,
    onCategoryChange: setCategory,
    authorId: draftAuthorId,
    onAuthorIdChange: setDraftAuthorId,
    onAuthorIdSubmit: submitAuthorId,
    startDate,
    endDate,
    onDateRangeChange: setDateRange,
    onPageChange: setPage,
    onReset: resetFilters,
    selectedPostId,
    onSelectPost: setSelectedPostId,
    onCloseDetail: () => setSelectedPostId(null),
  };
}
