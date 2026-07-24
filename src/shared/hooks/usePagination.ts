import { useMemo, useState } from 'react';

import { paginate } from '@/shared/utils';

// 목록 배열 하나를 받아 클라이언트 사이드로 페이지를 잘라주는 공용 hook.
// page는 항상 [1, pageCount] 범위로 clamp되어 목록이 줄어들어도 빈 화면을 보여주지 않는다.
export function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1);
  const result = useMemo(() => paginate(items, page, pageSize), [items, page, pageSize]);
  const pageCount = Math.max(1, Math.ceil(result.totalCount / pageSize));

  return {
    page: result.page,
    pageItems: result.items,
    pageCount,
    totalCount: result.totalCount,
    setPage,
  };
}
