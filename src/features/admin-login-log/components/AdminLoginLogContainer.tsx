import { useAdminLoginLog } from '../hooks/useAdminLoginLog';
import { AdminLoginLogPresenter } from './AdminLoginLogPresenter';

export function AdminLoginLogContainer() {
  const {
    histories,
    page,
    pageSize,
    totalCount,
    isLoading,
    isError,
    reload,
    userId,
    onUserIdChange,
    onUserIdSubmit,
    startDate,
    endDate,
    onDateRangeChange,
    onPageChange,
    onReset,
  } = useAdminLoginLog();

  return (
    <AdminLoginLogPresenter
      histories={histories}
      page={page}
      pageSize={pageSize}
      totalCount={totalCount}
      isLoading={isLoading}
      isError={isError}
      onReload={reload}
      onPageChange={onPageChange}
      userId={userId}
      onUserIdChange={onUserIdChange}
      onUserIdSubmit={onUserIdSubmit}
      startDate={startDate}
      endDate={endDate}
      onDateRangeChange={onDateRangeChange}
      onReset={onReset}
    />
  );
}
