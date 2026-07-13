import {
  type AdminPolicyApplicationStatus,
  useApplicationChecklistQuery,
  useUpdateAdminPolicyApplicationStatusMutation,
} from '@/entities/policy-application';
import { useToast } from '@/shared/ui';

// 정책 신청 상세 모달의 체크리스트 조회 + 상태 변경 mutation을 묶는다.
export function useAdminApplicationDetail(applicationId: string | null) {
  const { data: checklist = [], isLoading: isChecklistLoading } =
    useApplicationChecklistQuery(applicationId);
  const { showToast } = useToast();

  const statusMutation = useUpdateAdminPolicyApplicationStatusMutation();

  const changeStatus = (status: AdminPolicyApplicationStatus) => {
    if (!applicationId) return;
    statusMutation.mutate(
      { applicationId, status },
      { onSuccess: () => showToast('신청 상태가 변경되었습니다.', 'success') },
    );
  };

  return {
    checklist,
    isChecklistLoading,
    changeStatus,
    isChangingStatus: statusMutation.isPending,
  };
}
