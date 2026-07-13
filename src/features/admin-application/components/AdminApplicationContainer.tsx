import { useAdminApplication } from '../hooks/useAdminApplication';
import { useAdminApplicationDetail } from '../hooks/useAdminApplicationDetail';
import { AdminApplicationPresenter } from './AdminApplicationPresenter';

export function AdminApplicationContainer() {
  const {
    applications,
    page,
    pageSize,
    totalCount,
    isLoading,
    isError,
    reload,
    userId,
    onUserIdChange,
    onUserIdSubmit,
    policyName,
    onPolicyNameChange,
    onPolicyNameSubmit,
    status,
    onStatusChange,
    deadlineStart,
    deadlineEnd,
    onDeadlineRangeChange,
    onPageChange,
    onReset,
    selectedApplicationId,
    onSelectApplication,
    onCloseDetail,
  } = useAdminApplication();

  const selectedApplication =
    applications.find((application) => application.id === selectedApplicationId) ?? null;

  const { checklist, isChecklistLoading, changeStatus, isChangingStatus } =
    useAdminApplicationDetail(selectedApplicationId);

  return (
    <AdminApplicationPresenter
      applications={applications}
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
      policyName={policyName}
      onPolicyNameChange={onPolicyNameChange}
      onPolicyNameSubmit={onPolicyNameSubmit}
      status={status}
      onStatusChange={onStatusChange}
      deadlineStart={deadlineStart}
      deadlineEnd={deadlineEnd}
      onDeadlineRangeChange={onDeadlineRangeChange}
      onReset={onReset}
      selectedApplication={selectedApplication}
      checklist={checklist}
      isChecklistLoading={isChecklistLoading}
      onSelectApplication={(application) => onSelectApplication(application.id)}
      onCloseDetail={onCloseDetail}
      onChangeStatus={changeStatus}
      isChangingStatus={isChangingStatus}
    />
  );
}
