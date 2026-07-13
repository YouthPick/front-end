import { useAdminSearchLog } from '../hooks/useAdminSearchLog';
import { AdminSearchLogPresenter } from './AdminSearchLogPresenter';

export function AdminSearchLogContainer() {
  const {
    logs,
    page,
    pageSize,
    totalCount,
    isLoading,
    isError,
    reload,
    keyword,
    onKeywordChange,
    onKeywordSubmit,
    startDate,
    endDate,
    onDateRangeChange,
    onPageChange,
    onReset,
  } = useAdminSearchLog();

  return (
    <AdminSearchLogPresenter
      logs={logs}
      page={page}
      pageSize={pageSize}
      totalCount={totalCount}
      isLoading={isLoading}
      isError={isError}
      onReload={reload}
      onPageChange={onPageChange}
      keyword={keyword}
      onKeywordChange={onKeywordChange}
      onKeywordSubmit={onKeywordSubmit}
      startDate={startDate}
      endDate={endDate}
      onDateRangeChange={onDateRangeChange}
      onReset={onReset}
    />
  );
}
