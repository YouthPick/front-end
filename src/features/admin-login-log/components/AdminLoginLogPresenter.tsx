import type { ColumnDef } from '@tanstack/react-table';

import type { LoginHistory } from '@/entities/login-history';
import { DataTable } from '@/shared/ui';
import { formatDateTime } from '@/shared/utils';

import { AdminLoginLogFilters } from './AdminLoginLogFilters';

interface AdminLoginLogPresenterProps {
  histories: LoginHistory[];
  page: number;
  pageSize: number;
  totalCount: number;
  isLoading: boolean;
  isError: boolean;
  onReload: () => void;
  onPageChange: (page: number) => void;
  userId: string;
  onUserIdChange: (value: string) => void;
  onUserIdSubmit: () => void;
  startDate: string;
  endDate: string;
  onDateRangeChange: (range: { startDate?: string; endDate?: string }) => void;
  onReset: () => void;
}

const COLUMNS: ColumnDef<LoginHistory>[] = [
  {
    accessorKey: 'userId',
    header: '사용자 ID',
  },
  {
    accessorKey: 'createdAt',
    header: '로그인 일시',
    cell: ({ getValue }) => formatDateTime(getValue<string>()),
  },
];

export function AdminLoginLogPresenter({
  histories,
  page,
  pageSize,
  totalCount,
  isLoading,
  isError,
  onReload,
  onPageChange,
  userId,
  onUserIdChange,
  onUserIdSubmit,
  startDate,
  endDate,
  onDateRangeChange,
  onReset,
}: AdminLoginLogPresenterProps) {
  return (
    <DataTable
      title="로그인 로그"
      columns={COLUMNS}
      data={histories}
      getRowId={(row) => row.id}
      isLoading={isLoading}
      isError={isError}
      errorTitle="로그인 로그를 불러오지 못했습니다"
      onRetry={onReload}
      emptyIcon="🔍"
      emptyTitle="조회된 로그인 로그가 없습니다"
      emptyDescription="검색 조건을 변경해 다시 시도해 주세요."
      toolbar={
        <AdminLoginLogFilters
          userId={userId}
          onUserIdChange={onUserIdChange}
          onUserIdSubmit={onUserIdSubmit}
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
