import {
  type AdminPolicy,
  type AdminPolicyUpdateInput,
  type AdminPolicyVisibilityStatus,
  mapAdminPolicyDtoToAdminPolicy,
  useSetAdminPolicyVisibilityMutation,
  useSoftDeleteAdminPolicyMutation,
  useUpdateAdminPolicyMutation,
} from '@/entities/policy';
import { useRegionsQuery } from '@/entities/region';
import { useToast } from '@/shared/ui';

// 정책 상세/수정 모달의 지역 참조 데이터 조회 + 저장/노출토글/탈퇴(soft delete) mutation을 묶는다.
// onUpdated는 mutation 성공 시 받은 최신 정책 값을 호출부의 selectedPolicy 상태로 반영한다
// (필터링된 목록에서 다시 찾는 방식은 그 정책이 필터 조건에서 빠지면 모달이 사라지는 문제가 있다).
export function useAdminPolicyDetail(
  policyId: string | null,
  onUpdated: (policy: AdminPolicy) => void,
) {
  const { data: regions = [], isLoading: isRegionsLoading } = useRegionsQuery();
  const { showToast } = useToast();

  const updateMutation = useUpdateAdminPolicyMutation();
  const visibilityMutation = useSetAdminPolicyVisibilityMutation();
  const deleteMutation = useSoftDeleteAdminPolicyMutation();

  const saveChanges = (input: AdminPolicyUpdateInput) => {
    if (!policyId) return;
    updateMutation.mutate(
      { policyId, input },
      {
        onSuccess: (updatedDto) => {
          onUpdated(mapAdminPolicyDtoToAdminPolicy(updatedDto));
          showToast('정책 정보가 저장되었습니다.', 'success');
        },
        onError: () =>
          showToast('정책 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'warning'),
      },
    );
  };

  const toggleVisibility = (visibilityStatus: AdminPolicyVisibilityStatus) => {
    if (!policyId) return;
    visibilityMutation.mutate(
      { policyId, visibilityStatus },
      {
        onSuccess: (updatedDto) => {
          onUpdated(mapAdminPolicyDtoToAdminPolicy(updatedDto));
          showToast(
            visibilityStatus === 'VISIBLE'
              ? '정책을 노출로 전환했습니다.'
              : '정책을 비노출로 전환했습니다.',
            'success',
          );
        },
        onError: () =>
          showToast('공개상태 전환에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'warning'),
      },
    );
  };

  const deletePolicy = () => {
    if (!policyId) return;
    deleteMutation.mutate(policyId, {
      onSuccess: (updatedDto) => {
        onUpdated(mapAdminPolicyDtoToAdminPolicy(updatedDto));
        showToast('정책을 삭제(soft delete) 처리했습니다.', 'warning');
      },
      onError: () => showToast('정책 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'warning'),
    });
  };

  return {
    regions,
    isRegionsLoading,
    saveChanges,
    isSaving: updateMutation.isPending,
    toggleVisibility,
    isTogglingVisibility: visibilityMutation.isPending,
    deletePolicy,
    isDeleting: deleteMutation.isPending,
  };
}
