import type { ColumnDef } from '@tanstack/react-table';

import type {
  AdminPolicy,
  AdminPolicyUpdateInput,
  AdminPolicyVisibilityStatus,
} from '@/entities/policy';
import type { Region } from '@/entities/region';
import { DataTable } from '@/shared/ui';

import { AdminPolicyDetailModal } from './AdminPolicyDetailModal';
import { AdminPolicyFilters } from './AdminPolicyFilters';

interface AdminPolicyPresenterProps {
  policies: AdminPolicy[];
  page: number;
  pageSize: number;
  totalCount: number;
  isLoading: boolean;
  isError: boolean;
  onReload: () => void;
  onPageChange: (page: number) => void;
  category: string | undefined;
  onCategoryChange: (value: string) => void;
  visibilityStatus: AdminPolicyVisibilityStatus | undefined;
  onVisibilityStatusChange: (value: string) => void;
  startDate: string;
  endDate: string;
  onDateRangeChange: (range: { startDate?: string; endDate?: string }) => void;
  onReset: () => void;
  selectedPolicy: AdminPolicy | null;
  regions: Region[];
  isRegionsLoading: boolean;
  onSelectPolicy: (policy: AdminPolicy) => void;
  onCloseDetail: () => void;
  onSave: (input: AdminPolicyUpdateInput) => void;
  isSaving: boolean;
  onToggleVisibility: (status: AdminPolicyVisibilityStatus) => void;
  isTogglingVisibility: boolean;
  onDelete: () => void;
  isDeleting: boolean;
}

export function AdminPolicyPresenter({
  policies,
  page,
  pageSize,
  totalCount,
  isLoading,
  isError,
  onReload,
  onPageChange,
  category,
  onCategoryChange,
  visibilityStatus,
  onVisibilityStatusChange,
  startDate,
  endDate,
  onDateRangeChange,
  onReset,
  selectedPolicy,
  regions,
  isRegionsLoading,
  onSelectPolicy,
  onCloseDetail,
  onSave,
  isSaving,
  onToggleVisibility,
  isTogglingVisibility,
  onDelete,
  isDeleting,
}: AdminPolicyPresenterProps) {
  const columns: ColumnDef<AdminPolicy>[] = [
    {
      accessorKey: 'policyName',
      header: '정책명',
      cell: ({ getValue }) => (
        <span
          className="block max-w-[220px] truncate font-bold text-slate-700"
          title={getValue<string>()}
        >
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: 'organizationName',
      header: '주관기관',
    },
    {
      accessorKey: 'largeCategory',
      header: '카테고리',
    },
    {
      id: 'period',
      header: '신청기간',
      cell: ({ row }) =>
        `${row.original.applicationStartDate} ~ ${row.original.applicationEndDate}`,
    },
    {
      id: 'status',
      header: '공개상태',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <span
            className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-black ${
              row.original.visibilityStatus === 'VISIBLE'
                ? 'bg-primary/10 text-primary'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {row.original.visibilityStatus === 'VISIBLE' ? '노출' : '비노출'}
          </span>
          {row.original.deletedAt !== null && (
            <span className="inline-block rounded px-1.5 py-0.5 text-[9px] font-black bg-rose-50 text-rose-600">
              삭제됨
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'detail',
      header: '',
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onSelectPolicy(row.original)}
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
        title="정책 관리"
        columns={columns}
        data={policies}
        getRowId={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        errorTitle="정책 목록을 불러오지 못했습니다"
        onRetry={onReload}
        emptyIcon="🔍"
        emptyTitle="조회된 정책이 없습니다"
        emptyDescription="검색 조건을 변경해 다시 시도해 주세요."
        toolbar={
          <AdminPolicyFilters
            category={category}
            onCategoryChange={onCategoryChange}
            visibilityStatus={visibilityStatus}
            onVisibilityStatusChange={onVisibilityStatusChange}
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

      <AdminPolicyDetailModal
        policy={selectedPolicy}
        regions={regions}
        isRegionsLoading={isRegionsLoading}
        onClose={onCloseDetail}
        onSave={onSave}
        isSaving={isSaving}
        onToggleVisibility={onToggleVisibility}
        isTogglingVisibility={isTogglingVisibility}
        onDelete={onDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
