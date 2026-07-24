import type { ColumnDef } from '@tanstack/react-table';

import type {
  AdminPolicyApplication,
  AdminPolicyApplicationStatus,
  ApplicationChecklistItem,
} from '@/entities/policy-application';
import { DataTable } from '@/shared/ui';

import { AdminApplicationDetailModal } from './AdminApplicationDetailModal';
import { AdminApplicationFilters } from './AdminApplicationFilters';

const STATUS_LABEL: Record<AdminPolicyApplicationStatus, string> = {
  INTERESTED: '관심',
  PREPARING: '준비중',
  SUBMITTED: '신청완료',
  CLOSED: '종료',
};

const STATUS_BADGE_CLASS: Record<AdminPolicyApplicationStatus, string> = {
  INTERESTED: 'bg-slate-100 text-slate-500',
  PREPARING: 'bg-amber-50 text-amber-600',
  SUBMITTED: 'bg-primary/10 text-primary',
  CLOSED: 'bg-emerald-50 text-emerald-600',
};

interface AdminApplicationPresenterProps {
  applications: AdminPolicyApplication[];
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
  policyName: string;
  onPolicyNameChange: (value: string) => void;
  onPolicyNameSubmit: () => void;
  status: AdminPolicyApplicationStatus | undefined;
  onStatusChange: (value: string) => void;
  deadlineStart: string;
  deadlineEnd: string;
  onDeadlineRangeChange: (range: { deadlineStart?: string; deadlineEnd?: string }) => void;
  onReset: () => void;
  selectedApplication: AdminPolicyApplication | null;
  checklist: ApplicationChecklistItem[];
  isChecklistLoading: boolean;
  onSelectApplication: (application: AdminPolicyApplication) => void;
  onCloseDetail: () => void;
  onChangeStatus: (status: AdminPolicyApplicationStatus) => void;
  isChangingStatus: boolean;
}

export function AdminApplicationPresenter({
  applications,
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
  policyName,
  onPolicyNameChange,
  onPolicyNameSubmit,
  status,
  onStatusChange,
  deadlineStart,
  deadlineEnd,
  onDeadlineRangeChange,
  onReset,
  selectedApplication,
  checklist,
  isChecklistLoading,
  onSelectApplication,
  onCloseDetail,
  onChangeStatus,
  isChangingStatus,
}: AdminApplicationPresenterProps) {
  const columns: ColumnDef<AdminPolicyApplication>[] = [
    {
      accessorKey: 'userId',
      header: '사용자 ID',
    },
    {
      accessorKey: 'policyName',
      header: '정책명',
      cell: ({ getValue }) => (
        <span className="block max-w-[200px] truncate" title={getValue<string>()}>
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: '상태',
      cell: ({ getValue }) => {
        const value = getValue<AdminPolicyApplicationStatus>();
        return (
          <span
            className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-black ${STATUS_BADGE_CLASS[value]}`}
          >
            {STATUS_LABEL[value]}
          </span>
        );
      },
    },
    {
      accessorKey: 'deadline',
      header: '마감일',
    },
    {
      id: 'detail',
      header: '',
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onSelectApplication(row.original)}
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
        title="정책 신청 관리"
        columns={columns}
        data={applications}
        getRowId={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        errorTitle="정책 신청 목록을 불러오지 못했습니다"
        onRetry={onReload}
        emptyIcon="🔍"
        emptyTitle="조회된 정책 신청이 없습니다"
        emptyDescription="검색 조건을 변경해 다시 시도해 주세요."
        toolbar={
          <AdminApplicationFilters
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
          />
        }
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={onPageChange}
      />

      <AdminApplicationDetailModal
        application={selectedApplication}
        checklist={checklist}
        isChecklistLoading={isChecklistLoading}
        onClose={onCloseDetail}
        onChangeStatus={onChangeStatus}
        isChangingStatus={isChangingStatus}
      />
    </>
  );
}
