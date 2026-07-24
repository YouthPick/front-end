import type { ColumnDef } from '@tanstack/react-table';

import type {
  AdminUser,
  AdminUserAccountStatus,
  AdminUserProfile,
  UserRole,
} from '@/entities/user';
import { DataTable } from '@/shared/ui';
import { formatDateTime } from '@/shared/utils';

import { AdminUserDetailModal } from './AdminUserDetailModal';
import { AdminUserFilters } from './AdminUserFilters';

const ROLE_BADGE_CLASS: Record<UserRole, string> = {
  admin: 'bg-primary/10 text-primary',
  member: 'bg-slate-100 text-slate-500',
};

interface AdminUserPresenterProps {
  users: AdminUser[];
  page: number;
  pageSize: number;
  totalCount: number;
  isLoading: boolean;
  isError: boolean;
  onReload: () => void;
  onPageChange: (page: number) => void;
  role: UserRole | undefined;
  onRoleChange: (value: string) => void;
  accountStatus: AdminUserAccountStatus | undefined;
  onAccountStatusChange: (value: string) => void;
  provider: string | undefined;
  onProviderChange: (value: string) => void;
  onReset: () => void;
  selectedUser: AdminUser | null;
  profile: AdminUserProfile | null | undefined;
  isProfileLoading: boolean;
  onSelectUser: (user: AdminUser) => void;
  onCloseDetail: () => void;
  onChangeRole: (role: UserRole) => void;
  isRoleChanging: boolean;
  onDelete: () => void;
  isDeleting: boolean;
}

export function AdminUserPresenter({
  users,
  page,
  pageSize,
  totalCount,
  isLoading,
  isError,
  onReload,
  onPageChange,
  role,
  onRoleChange,
  accountStatus,
  onAccountStatusChange,
  provider,
  onProviderChange,
  onReset,
  selectedUser,
  profile,
  isProfileLoading,
  onSelectUser,
  onCloseDetail,
  onChangeRole,
  isRoleChanging,
  onDelete,
  isDeleting,
}: AdminUserPresenterProps) {
  const columns: ColumnDef<AdminUser>[] = [
    {
      accessorKey: 'id',
      header: '사용자 ID',
    },
    {
      accessorKey: 'provider',
      header: '가입경로',
    },
    {
      accessorKey: 'role',
      header: '역할',
      cell: ({ getValue }) => {
        const value = getValue<UserRole>();
        return (
          <span
            className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-black ${ROLE_BADGE_CLASS[value]}`}
          >
            {value === 'admin' ? '관리자' : '일반 회원'}
          </span>
        );
      },
    },
    {
      id: 'accountStatus',
      header: '상태',
      cell: ({ row }) =>
        row.original.deletedAt !== null ? (
          <span className="inline-block rounded px-1.5 py-0.5 text-[9px] font-black bg-rose-50 text-rose-600">
            탈퇴
          </span>
        ) : (
          <span className="inline-block rounded px-1.5 py-0.5 text-[9px] font-black bg-emerald-50 text-emerald-600">
            활성
          </span>
        ),
    },
    {
      accessorKey: 'createdAt',
      header: '가입일',
      cell: ({ getValue }) => formatDateTime(getValue<string>()),
    },
    {
      id: 'detail',
      header: '',
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onSelectUser(row.original)}
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
        title="사용자 관리"
        columns={columns}
        data={users}
        getRowId={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        errorTitle="사용자 목록을 불러오지 못했습니다"
        onRetry={onReload}
        emptyIcon="🔍"
        emptyTitle="조회된 사용자가 없습니다"
        emptyDescription="검색 조건을 변경해 다시 시도해 주세요."
        toolbar={
          <AdminUserFilters
            role={role}
            onRoleChange={onRoleChange}
            accountStatus={accountStatus}
            onAccountStatusChange={onAccountStatusChange}
            provider={provider}
            onProviderChange={onProviderChange}
            onReset={onReset}
          />
        }
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={onPageChange}
      />

      <AdminUserDetailModal
        user={selectedUser}
        profile={profile}
        isProfileLoading={isProfileLoading}
        onClose={onCloseDetail}
        onChangeRole={onChangeRole}
        isRoleChanging={isRoleChanging}
        onDelete={onDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
