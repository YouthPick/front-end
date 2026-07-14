import type { ColumnDef } from '@tanstack/react-table';

import type { BatchJobLog, BatchJobLogStatus } from '@/entities/batch-job-log';
import { DataTable } from '@/shared/ui';
import { formatDateTime } from '@/shared/utils';

import { AdminBatchLogFilters } from './AdminBatchLogFilters';

const STATUS_BADGE_CLASS: Record<BatchJobLogStatus, string> = {
  SUCCESS: 'bg-emerald-50 text-emerald-600',
  PARTIAL: 'bg-amber-50 text-amber-600',
  FAILED: 'bg-rose-50 text-rose-600',
};

interface AdminBatchLogPresenterProps {
  logs: BatchJobLog[];
  page: number;
  pageSize: number;
  totalCount: number;
  isLoading: boolean;
  isError: boolean;
  onReload: () => void;
  onPageChange: (page: number) => void;
  status: BatchJobLogStatus | undefined;
  onStatusChange: (value: string) => void;
  startDate: string;
  endDate: string;
  onDateRangeChange: (range: { startDate?: string; endDate?: string }) => void;
  onReset: () => void;
}

const columns: ColumnDef<BatchJobLog>[] = [
  {
    accessorKey: 'executedAt',
    header: '실행 시각',
    cell: ({ getValue }) => formatDateTime(getValue<string>()),
  },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ getValue }) => {
      const value = getValue<BatchJobLogStatus>();
      return (
        <span
          className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-black ${STATUS_BADGE_CLASS[value]}`}
        >
          {value}
        </span>
      );
    },
  },
  {
    accessorKey: 'createdPolicyCount',
    header: '신규 등재',
    cell: ({ getValue }) => `+${getValue<number>()}`,
  },
  {
    accessorKey: 'updatedPolicyCount',
    header: '기존 변경',
  },
  {
    accessorKey: 'disappearedPolicyCount',
    header: '원본 누락',
  },
  {
    accessorKey: 'failedPolicyCount',
    header: '실패',
  },
];

export function AdminBatchLogPresenter({
  logs,
  page,
  pageSize,
  totalCount,
  isLoading,
  isError,
  onReload,
  onPageChange,
  status,
  onStatusChange,
  startDate,
  endDate,
  onDateRangeChange,
  onReset,
}: AdminBatchLogPresenterProps) {
  return (
    <DataTable
      title="배치 작업 로그"
      columns={columns}
      data={logs}
      getRowId={(row) => row.id}
      isLoading={isLoading}
      isError={isError}
      errorTitle="배치 작업 로그를 불러오지 못했습니다"
      onRetry={onReload}
      emptyIcon="🔍"
      emptyTitle="조회된 배치 작업 로그가 없습니다"
      emptyDescription="검색 조건을 변경해 다시 시도해 주세요."
      toolbar={
        <AdminBatchLogFilters
          status={status}
          onStatusChange={onStatusChange}
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
