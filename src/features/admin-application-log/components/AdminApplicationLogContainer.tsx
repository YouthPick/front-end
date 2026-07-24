import { useAdminApplicationLog } from '../hooks/useAdminApplicationLog';
import { AdminApplicationLogPresenter } from './AdminApplicationLogPresenter';

export function AdminApplicationLogContainer() {
  const {
    logs,
    page,
    pageSize,
    totalCount,
    isLoading,
    isError,
    reload,
    logLevel,
    onLogLevelChange,
    keyword,
    onKeywordChange,
    onKeywordSubmit,
    startDate,
    endDate,
    onDateRangeChange,
    onPageChange,
    onReset,
    selectedLog,
    onSelectLog,
    onCloseDetail,
  } = useAdminApplicationLog();

  return (
    <AdminApplicationLogPresenter
      logs={logs}
      page={page}
      pageSize={pageSize}
      totalCount={totalCount}
      isLoading={isLoading}
      isError={isError}
      onReload={reload}
      onPageChange={onPageChange}
      logLevel={logLevel}
      onLogLevelChange={onLogLevelChange}
      keyword={keyword}
      onKeywordChange={onKeywordChange}
      onKeywordSubmit={onKeywordSubmit}
      startDate={startDate}
      endDate={endDate}
      onDateRangeChange={onDateRangeChange}
      onReset={onReset}
      selectedLog={selectedLog}
      onSelectLog={onSelectLog}
      onCloseDetail={onCloseDetail}
    />
  );
}
