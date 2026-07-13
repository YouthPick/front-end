import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DataTablePaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function DataTablePagination({
  page,
  pageSize,
  totalCount,
  onPageChange,
}: DataTablePaginationProps) {
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));
  const canGoPrev = page > 1;
  const canGoNext = page < pageCount;

  return (
    <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
      <span>
        전체{' '}
        <strong className="font-bold text-slate-700">{totalCount.toLocaleString('ko-KR')}</strong>건
        · {page} / {pageCount} 페이지
      </span>
      <div className="flex items-center space-x-1.5">
        <button
          type="button"
          aria-label="이전 페이지"
          disabled={!canGoPrev}
          onClick={() => onPageChange(page - 1)}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-100 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label="다음 페이지"
          disabled={!canGoNext}
          onClick={() => onPageChange(page + 1)}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-100 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
