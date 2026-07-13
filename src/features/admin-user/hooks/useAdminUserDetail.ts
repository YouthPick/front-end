import {
  type UserRole,
  useAdminUserProfileQuery,
  useSoftDeleteAdminUserMutation,
  useUpdateAdminUserRoleMutation,
} from '@/entities/user';
import { useToast } from '@/shared/ui';

// 사용자 상세 모달의 프로필 조회 + role 변경/탈퇴 처리 mutation을 묶는다.
export function useAdminUserDetail(userId: string | null) {
  const { data: profile, isLoading: isProfileLoading } = useAdminUserProfileQuery(userId);
  const { showToast } = useToast();

  const roleMutation = useUpdateAdminUserRoleMutation();
  const deleteMutation = useSoftDeleteAdminUserMutation();

  const changeRole = (role: UserRole) => {
    if (!userId) return;
    roleMutation.mutate(
      { userId, role },
      { onSuccess: () => showToast('사용자 역할이 변경되었습니다.', 'success') },
    );
  };

  const deleteUser = () => {
    if (!userId) return;
    deleteMutation.mutate(userId, {
      onSuccess: () => showToast('사용자를 탈퇴 처리했습니다.', 'warning'),
    });
  };

  return {
    profile,
    isProfileLoading,
    changeRole,
    isRoleChanging: roleMutation.isPending,
    deleteUser,
    isDeleting: deleteMutation.isPending,
  };
}
