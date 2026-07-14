import { useAdminBatchLog } from '../hooks/useAdminBatchLog';
import { AdminBatchLogPresenter } from './AdminBatchLogPresenter';

export function AdminBatchLogContainer() {
  const {
    logs,
    page,
    pageSize,
    totalCount,
    isLoading,
    isError,
    reload,
    status,
    onStatusChange,
    startDate,
    endDate,
    onDateRangeChange,
    onPageChange,
    onReset,
  } = useAdminBatchLog();

  return (
    <AdminBatchLogPresenter
      logs={logs}
      page={page}
      pageSize={pageSize}
      totalCount={totalCount}
      isLoading={isLoading}
      isError={isError}
      onReload={reload}
      onPageChange={onPageChange}
      status={status}
      onStatusChange={onStatusChange}
      startDate={startDate}
      endDate={endDate}
      onDateRangeChange={onDateRangeChange}
      onReset={onReset}
    />
  );
}
