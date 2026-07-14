import {
  type AdminPolicyApplication,
  type AdminPolicyApplicationStatus,
  mapAdminPolicyApplicationDtoToAdminPolicyApplication,
  useApplicationChecklistQuery,
  useUpdateAdminPolicyApplicationStatusMutation,
} from '@/entities/policy-application';
import { useToast } from '@/shared/ui';

// 정책 신청 상세 모달의 체크리스트 조회 + 상태 변경 mutation을 묶는다.
// onUpdated는 mutation 성공 시 받은 최신 신청 값을 호출부의 selectedApplication 상태로 반영한다
// (필터링된 목록에서 다시 찾는 방식은 그 신청이 필터 조건에서 빠지면 모달이 사라지는 문제가 있다).
export function useAdminApplicationDetail(
  applicationId: string | null,
  onUpdated: (application: AdminPolicyApplication) => void,
) {
  const { data: checklist = [], isLoading: isChecklistLoading } =
    useApplicationChecklistQuery(applicationId);
  const { showToast } = useToast();

  const statusMutation = useUpdateAdminPolicyApplicationStatusMutation();

  const changeStatus = (status: AdminPolicyApplicationStatus) => {
    if (!applicationId) return;
    statusMutation.mutate(
      { applicationId, status },
      {
        onSuccess: (updatedDto) => {
          onUpdated(mapAdminPolicyApplicationDtoToAdminPolicyApplication(updatedDto));
          showToast('신청 상태가 변경되었습니다.', 'success');
        },
        onError: () =>
          showToast('상태 변경에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'warning'),
      },
    );
  };

  return {
    checklist,
    isChecklistLoading,
    changeStatus,
    isChangingStatus: statusMutation.isPending,
  };
}
