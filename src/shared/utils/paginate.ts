import type { PageResult } from '@/shared/types';

// page가 1 미만이거나 마지막 페이지를 넘는 값으로 들어와도 안전하게 [1, pageCount] 범위로 clamp한다.
export function paginate<T>(items: T[], page: number, pageSize: number): PageResult<T> {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const clampedPage = Math.min(Math.max(1, Math.trunc(page)), pageCount);
  const start = (clampedPage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: clampedPage,
    pageSize,
    totalCount: items.length,
  };
}
