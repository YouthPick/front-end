import {
  type AdminPolicyUpdateInput,
  type AdminPolicyVisibilityStatus,
  useSetAdminPolicyVisibilityMutation,
  useSoftDeleteAdminPolicyMutation,
  useUpdateAdminPolicyMutation,
} from '@/entities/policy';
import { useRegionsQuery } from '@/entities/region';
import { useToast } from '@/shared/ui';

// 정책 상세/수정 모달의 지역 참조 데이터 조회 + 저장/노출토글/탈퇴(soft delete) mutation을 묶는다.
export function useAdminPolicyDetail(policyId: string | null) {
  const { data: regions = [], isLoading: isRegionsLoading } = useRegionsQuery();
  const { showToast } = useToast();

  const updateMutation = useUpdateAdminPolicyMutation();
  const visibilityMutation = useSetAdminPolicyVisibilityMutation();
  const deleteMutation = useSoftDeleteAdminPolicyMutation();

  const saveChanges = (input: AdminPolicyUpdateInput) => {
    if (!policyId) return;
    updateMutation.mutate(
      { policyId, input },
      { onSuccess: () => showToast('정책 정보가 저장되었습니다.', 'success') },
    );
  };

  const toggleVisibility = (visibilityStatus: AdminPolicyVisibilityStatus) => {
    if (!policyId) return;
    visibilityMutation.mutate(
      { policyId, visibilityStatus },
      {
        onSuccess: () =>
          showToast(
            visibilityStatus === 'VISIBLE'
              ? '정책을 노출로 전환했습니다.'
              : '정책을 비노출로 전환했습니다.',
            'success',
          ),
      },
    );
  };

  const deletePolicy = () => {
    if (!policyId) return;
    deleteMutation.mutate(policyId, {
      onSuccess: () => showToast('정책을 삭제(soft delete) 처리했습니다.', 'warning'),
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
