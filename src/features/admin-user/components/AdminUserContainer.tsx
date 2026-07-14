import { useAdminUser } from '../hooks/useAdminUser';
import { useAdminUserDetail } from '../hooks/useAdminUserDetail';
import { AdminUserPresenter } from './AdminUserPresenter';

export function AdminUserContainer() {
  const {
    users,
    page,
    pageSize,
    totalCount,
    isLoading,
    isError,
    reload,
    role,
    onRoleChange,
    accountStatus,
    onAccountStatusChange,
    provider,
    onProviderChange,
    onPageChange,
    onReset,
    selectedUser,
    onSelectUser,
    onCloseDetail,
  } = useAdminUser();

  const { profile, isProfileLoading, changeRole, isRoleChanging, deleteUser, isDeleting } =
    useAdminUserDetail(selectedUser?.id ?? null, onSelectUser);

  return (
    <AdminUserPresenter
      users={users}
      page={page}
      pageSize={pageSize}
      totalCount={totalCount}
      isLoading={isLoading}
      isError={isError}
      onReload={reload}
      onPageChange={onPageChange}
      role={role}
      onRoleChange={onRoleChange}
      accountStatus={accountStatus}
      onAccountStatusChange={onAccountStatusChange}
      provider={provider}
      onProviderChange={onProviderChange}
      onReset={onReset}
      selectedUser={selectedUser}
      profile={profile}
      isProfileLoading={isProfileLoading}
      onSelectUser={onSelectUser}
      onCloseDetail={onCloseDetail}
      onChangeRole={changeRole}
      isRoleChanging={isRoleChanging}
      onDelete={deleteUser}
      isDeleting={isDeleting}
    />
  );
}
