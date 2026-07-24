import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

// 좌/우 ellipsis는 알고리즘상 각각 최대 1개만 나타나므로, 두 값을 구분되는 문자열로 둬서
// map의 key로 index 없이 바로 쓸 수 있게 한다.
const ELLIPSIS_START = 'ellipsis-start';
const ELLIPSIS_END = 'ellipsis-end';
type Ellipsis = typeof ELLIPSIS_START | typeof ELLIPSIS_END;

function isEllipsis(item: number | Ellipsis): item is Ellipsis {
  return item === ELLIPSIS_START || item === ELLIPSIS_END;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

// 현재 페이지 주변(siblingCount)과 처음/끝 페이지만 보여주고 나머지는 ellipsis로 축약한다.
function getPageRange(
  page: number,
  pageCount: number,
  siblingCount: number,
): (number | Ellipsis)[] {
  const totalSlots = siblingCount * 2 + 5;

  if (pageCount <= totalSlots) {
    return range(1, pageCount);
  }

  const leftSibling = Math.max(page - siblingCount, 1);
  const rightSibling = Math.min(page + siblingCount, pageCount);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < pageCount - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    return [...range(1, 3 + siblingCount * 2), ELLIPSIS_END, pageCount];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    return [1, ELLIPSIS_START, ...range(pageCount - (3 + siblingCount * 2) + 1, pageCount)];
  }

  return [1, ELLIPSIS_START, ...range(leftSibling, rightSibling), ELLIPSIS_END, pageCount];
}

// 목록 화면 공용 페이지 번호 네비게이션. 서버/클라이언트 페이지네이션 어느 쪽이든
// page·pageCount·onPageChange만 넘기면 동작한다.
export function Pagination({ page, pageCount, onPageChange, siblingCount = 1 }: PaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  const pageNumbers = getPageRange(page, pageCount, siblingCount);
  const canGoPrev = page > 1;
  const canGoNext = page < pageCount;

  return (
    <nav aria-label="페이지네이션" className="flex items-center justify-center gap-1.5">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={!canGoPrev}
        onClick={() => onPageChange(page - 1)}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pageNumbers.map((item) =>
        isEllipsis(item) ? (
          <span
            key={item}
            className="flex h-8 w-8 items-center justify-center text-xs text-slate-300"
          >
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-label={`${item} 페이지`}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onPageChange(item)}
            className={
              item === page
                ? 'flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground'
                : 'flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50'
            }
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="다음 페이지"
        disabled={!canGoNext}
        onClick={() => onPageChange(page + 1)}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
