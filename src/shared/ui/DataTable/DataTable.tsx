import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type OnChangeFn,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react';
import type { ReactNode } from 'react';

import { EmptyState } from '../EmptyState';
import { ErrorState } from '../ErrorState';
import { Skeleton } from '../Skeleton';
import { DataTablePagination } from './DataTablePagination';

interface DataTableProps<T> {
  title?: string;
  columns: ColumnDef<T>[];
  data: T[];
  getRowId: (row: T) => string;
  isLoading?: boolean;
  isError?: boolean;
  errorTitle?: string;
  onRetry?: () => void;
  emptyIcon?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  toolbar?: ReactNode;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  // data는 이미 서버(mock)에서 정렬·페이지네이션된 한 페이지 분량이라 클라이언트 재정렬을 하지 않는다.
  // 정렬 상태는 호출부가 소유하고 쿼리 파라미터로 반영해야 하므로 항상 controlled + manualSorting으로 동작한다.
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
}

export function DataTable<T>({
  title,
  columns,
  data,
  getRowId,
  isLoading = false,
  isError = false,
  errorTitle = '목록을 불러오지 못했습니다',
  onRetry,
  emptyIcon,
  emptyTitle = '표시할 데이터가 없습니다',
  emptyDescription,
  toolbar,
  page,
  pageSize,
  totalCount,
  onPageChange,
  sorting,
  onSortingChange,
}: DataTableProps<T>) {
  const canInteractSort = Boolean(onSortingChange);

  const table = useReactTable({
    data,
    columns,
    state: sorting ? { sorting } : undefined,
    onSortingChange,
    manualSorting: true,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-3xl bg-white border border-slate-100 p-5 text-left space-y-4 shadow-sm">
      {(title || toolbar) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {title && <h4 className="text-xs font-extrabold text-slate-800">{title}</h4>}
          {toolbar}
        </div>
      )}

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: Math.min(pageSize, 10) }, (_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: 순서가 바뀌지 않는 정적 로딩 플레이스홀더라 안정적인 id가 없다
            <Skeleton key={index} className="h-9" />
          ))}
        </div>
      )}

      {!isLoading && isError && <ErrorState title={errorTitle} onRetry={onRetry} />}

      {!isLoading && !isError && data.length === 0 && (
        <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
      )}

      {!isLoading && !isError && data.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-500">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const canSort = canInteractSort && header.column.getCanSort();
                      const sortDirection = header.column.getIsSorted();

                      return (
                        <th
                          key={header.id}
                          className="py-2.5 px-3 text-left"
                          aria-sort={
                            canSort
                              ? sortDirection === 'asc'
                                ? 'ascending'
                                : sortDirection === 'desc'
                                  ? 'descending'
                                  : 'none'
                              : undefined
                          }
                        >
                          {header.isPlaceholder ? null : canSort ? (
                            <button
                              type="button"
                              onClick={header.column.getToggleSortingHandler()}
                              className="inline-flex items-center space-x-1 hover:text-slate-600"
                            >
                              <span>
                                {flexRender(header.column.columnDef.header, header.getContext())}
                              </span>
                              {sortDirection === 'asc' && <ChevronUp className="h-3 w-3" />}
                              {sortDirection === 'desc' && <ChevronDown className="h-3 w-3" />}
                              {!sortDirection && <ChevronsUpDown className="h-3 w-3 opacity-40" />}
                            </button>
                          ) : (
                            flexRender(header.column.columnDef.header, header.getContext())
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-slate-100">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-3 px-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <DataTablePagination
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  );
}
