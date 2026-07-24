import type { ColumnDef } from '@tanstack/react-table';

import type { ApplicationLog, ApplicationLogLevel } from '@/entities/application-log';
import { DataTable } from '@/shared/ui';
import { formatDateTime } from '@/shared/utils';

import { AdminApplicationLogFilters } from './AdminApplicationLogFilters';
import { ApplicationLogDetailModal } from './ApplicationLogDetailModal';

const LOG_LEVEL_BADGE_CLASS: Record<ApplicationLogLevel, string> = {
  ERROR: 'bg-rose-50 text-rose-600',
  WARN: 'bg-amber-50 text-amber-600',
  INFO: 'bg-primary/10 text-primary',
  DEBUG: 'bg-slate-100 text-slate-500',
};

interface AdminApplicationLogPresenterProps {
  logs: ApplicationLog[];
  page: number;
  pageSize: number;
  totalCount: number;
  isLoading: boolean;
  isError: boolean;
  onReload: () => void;
  onPageChange: (page: number) => void;
  logLevel: ApplicationLogLevel | undefined;
  onLogLevelChange: (value: string) => void;
  keyword: string;
  onKeywordChange: (value: string) => void;
  onKeywordSubmit: () => void;
  startDate: string;
  endDate: string;
  onDateRangeChange: (range: { startDate?: string; endDate?: string }) => void;
  onReset: () => void;
  selectedLog: ApplicationLog | null;
  onSelectLog: (log: ApplicationLog) => void;
  onCloseDetail: () => void;
}

export function AdminApplicationLogPresenter({
  logs,
  page,
  pageSize,
  totalCount,
  isLoading,
  isError,
  onReload,
  onPageChange,
  logLevel,
  onLogLevelChange,
  keyword,
  onKeywordChange,
  onKeywordSubmit,
  startDate,
  endDate,
  onDateRangeChange,
  onReset,
  selectedLog,
  onSelectLog,
  onCloseDetail,
}: AdminApplicationLogPresenterProps) {
  const columns: ColumnDef<ApplicationLog>[] = [
    {
      accessorKey: 'logLevel',
      header: '레벨',
      cell: ({ getValue }) => {
        const level = getValue<ApplicationLogLevel>();
        return (
          <span
            className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-black ${LOG_LEVEL_BADGE_CLASS[level]}`}
          >
            {level}
          </span>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: '발생 시각',
      cell: ({ getValue }) => formatDateTime(getValue<string>()),
    },
    {
      accessorKey: 'message',
      header: '메시지',
      cell: ({ getValue }) => (
        <span className="block max-w-xs truncate" title={getValue<string>()}>
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: 'traceId',
      header: 'Trace ID',
    },
    {
      id: 'detail',
      header: '',
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onSelectLog(row.original)}
          className="rounded-lg px-2 py-1 text-[10px] font-bold text-primary hover:bg-primary/5"
        >
          상세보기
        </button>
      ),
    },
  ];

  return (
    <>
      <DataTable
        title="애플리케이션 로그"
        columns={columns}
        data={logs}
        getRowId={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        errorTitle="애플리케이션 로그를 불러오지 못했습니다"
        onRetry={onReload}
        emptyIcon="🔍"
        emptyTitle="조회된 애플리케이션 로그가 없습니다"
        emptyDescription="검색 조건을 변경해 다시 시도해 주세요."
        toolbar={
          <AdminApplicationLogFilters
            logLevel={logLevel}
            onLogLevelChange={onLogLevelChange}
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

      <ApplicationLogDetailModal log={selectedLog} onClose={onCloseDetail} />
    </>
  );
}
