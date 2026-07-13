import {
  type AdminUser,
  mapAdminUserDtoToAdminUser,
  type UserRole,
  useAdminUserProfileQuery,
  useSoftDeleteAdminUserMutation,
  useUpdateAdminUserRoleMutation,
} from '@/entities/user';
import { useToast } from '@/shared/ui';

// 사용자 상세 모달의 프로필 조회 + role 변경/탈퇴 처리 mutation을 묶는다.
// onUpdated는 mutation 성공 시 받은 최신 사용자 값을 호출부의 selectedUser 상태로 반영한다
// (필터링된 목록에서 다시 찾는 방식은 그 사용자가 필터 조건에서 빠지면 모달이 사라지는 문제가 있다).
export function useAdminUserDetail(userId: string | null, onUpdated: (user: AdminUser) => void) {
  const { data: profile, isLoading: isProfileLoading } = useAdminUserProfileQuery(userId);
  const { showToast } = useToast();

  const roleMutation = useUpdateAdminUserRoleMutation();
  const deleteMutation = useSoftDeleteAdminUserMutation();

  const changeRole = (role: UserRole) => {
    if (!userId) return;
    roleMutation.mutate(
      { userId, role },
      {
        onSuccess: (updatedDto) => {
          onUpdated(mapAdminUserDtoToAdminUser(updatedDto));
          showToast('사용자 역할이 변경되었습니다.', 'success');
        },
        onError: () =>
          showToast('역할 변경에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'warning'),
      },
    );
  };

  const deleteUser = () => {
    if (!userId) return;
    deleteMutation.mutate(userId, {
      onSuccess: (updatedDto) => {
        onUpdated(mapAdminUserDtoToAdminUser(updatedDto));
        showToast('사용자를 탈퇴 처리했습니다.', 'warning');
      },
      onError: () => showToast('탈퇴 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'warning'),
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
