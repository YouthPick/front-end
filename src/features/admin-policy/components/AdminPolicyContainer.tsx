import { useAdminPolicy } from '../hooks/useAdminPolicy';
import { useAdminPolicyDetail } from '../hooks/useAdminPolicyDetail';
import { AdminPolicyPresenter } from './AdminPolicyPresenter';

export function AdminPolicyContainer() {
  const {
    policies,
    page,
    pageSize,
    totalCount,
    isLoading,
    isError,
    reload,
    category,
    onCategoryChange,
    visibilityStatus,
    onVisibilityStatusChange,
    startDate,
    endDate,
    onDateRangeChange,
    onPageChange,
    onReset,
    selectedPolicy,
    onSelectPolicy,
    onCloseDetail,
  } = useAdminPolicy();

  const {
    regions,
    isRegionsLoading,
    saveChanges,
    isSaving,
    toggleVisibility,
    isTogglingVisibility,
    deletePolicy,
    isDeleting,
  } = useAdminPolicyDetail(selectedPolicy?.id ?? null, onSelectPolicy);

  return (
    <AdminPolicyPresenter
      policies={policies}
      page={page}
      pageSize={pageSize}
      totalCount={totalCount}
      isLoading={isLoading}
      isError={isError}
      onReload={reload}
      onPageChange={onPageChange}
      category={category}
      onCategoryChange={onCategoryChange}
      visibilityStatus={visibilityStatus}
      onVisibilityStatusChange={onVisibilityStatusChange}
      startDate={startDate}
      endDate={endDate}
      onDateRangeChange={onDateRangeChange}
      onReset={onReset}
      selectedPolicy={selectedPolicy}
      regions={regions}
      isRegionsLoading={isRegionsLoading}
      onSelectPolicy={onSelectPolicy}
      onCloseDetail={onCloseDetail}
      onSave={saveChanges}
      isSaving={isSaving}
      onToggleVisibility={toggleVisibility}
      isTogglingVisibility={isTogglingVisibility}
      onDelete={deletePolicy}
      isDeleting={isDeleting}
    />
  );
}
