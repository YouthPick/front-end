import { useState } from 'react';

import { useCommunityPostPageQuery } from '@/entities/community-post';

// widgets/community-post-grid의 COMMUNITY_POST_GRID_SKELETON_COUNT(3열 x 2행)와 값을 맞춰
// 로딩 스켈레톤 개수와 실제 페이지당 카드 개수가 어긋나지 않게 한다.
const COMMUNITY_PAGE_SIZE = 6;

// 커뮤니티 목록 화면 use case: 서버 페이지네이션(최신순 고정) 게시글 조회를 담당한다.
// 검색어/카테고리 필터, 조회수·댓글·좋아요순 정렬은 백엔드 GET /api/v1/posts가 아직
// 지원하지 않아 화면에서 임시로 뺐다. 백엔드가 지원하면 useCommunityBoardFilters를 다시 연결한다.
export function useCommunityBoard() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useCommunityPostPageQuery({
    page,
    pageSize: COMMUNITY_PAGE_SIZE,
  });

  const posts = data?.items ?? [];
  const pageCount = Math.max(1, Math.ceil((data?.totalCount ?? 0) / COMMUNITY_PAGE_SIZE));

  return {
    posts,
    page,
    pageItems: posts,
    pageCount,
    setPage,
    isLoading,
    isError,
    reload: refetch,
  };
}
