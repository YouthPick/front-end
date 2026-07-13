import type { ColumnDef } from '@tanstack/react-table';

import type { SearchLog } from '@/entities/search-log';
import { DataTable } from '@/shared/ui';
import { formatDateTime } from '@/shared/utils';

import { AdminSearchLogFilters } from './AdminSearchLogFilters';

interface AdminSearchLogPresenterProps {
  logs: SearchLog[];
  page: number;
  pageSize: number;
  totalCount: number;
  isLoading: boolean;
  isError: boolean;
  onReload: () => void;
  onPageChange: (page: number) => void;
  keyword: string;
  onKeywordChange: (value: string) => void;
  onKeywordSubmit: () => void;
  startDate: string;
  endDate: string;
  onDateRangeChange: (range: { startDate?: string; endDate?: string }) => void;
  onReset: () => void;
}

const columns: ColumnDef<SearchLog>[] = [
  {
    accessorKey: 'originalQuery',
    header: '검색어',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value.trim() === '' ? <span className="text-slate-400">(공백)</span> : value;
    },
  },
  {
    accessorKey: 'normalizedQuery',
    header: '정규화된 검색어',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value === '' ? <span className="text-slate-400">-</span> : value;
    },
  },
  {
    accessorKey: 'resultCount',
    header: '결과 수',
    cell: ({ getValue }) => `${getValue<number>()}건`,
  },
  {
    accessorKey: 'searchedAt',
    header: '검색 시각',
    cell: ({ getValue }) => formatDateTime(getValue<string>()),
  },
];

export function AdminSearchLogPresenter({
  logs,
  page,
  pageSize,
  totalCount,
  isLoading,
  isError,
  onReload,
  onPageChange,
  keyword,
  onKeywordChange,
  onKeywordSubmit,
  startDate,
  endDate,
  onDateRangeChange,
  onReset,
}: AdminSearchLogPresenterProps) {
  return (
    <DataTable
      title="검색 로그"
      columns={columns}
      data={logs}
      getRowId={(row) => row.id}
      isLoading={isLoading}
      isError={isError}
      errorTitle="검색 로그를 불러오지 못했습니다"
      onRetry={onReload}
      emptyIcon="🔍"
      emptyTitle="조회된 검색 로그가 없습니다"
      emptyDescription="검색 조건을 변경해 다시 시도해 주세요."
      toolbar={
        <AdminSearchLogFilters
          keyword={keyword}
          onKeywordChange={onKeywordChange}
          onKeywordSubmit={onKeywordSubmit}
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={onDateRangeChange}
          onReset={onReset}
        />
      }
      page={page}
      pageSize={pageSize}
      totalCount={totalCount}
      onPageChange={onPageChange}
    />
  );
}
