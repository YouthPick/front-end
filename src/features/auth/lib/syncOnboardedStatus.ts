import { fetchMyProfile, useProfileStore } from '@/entities/user';

// 서버의 온보딩 프로필 존재 여부로 로컬 isOnboarded 플래그를 맞춘다. 새 기기/브라우저이거나
// localStorage가 비어있는 세션에서는 로컬 플래그가 기본값(false)으로 남아있어, 이미 온보딩을
// 마친 사용자도 온보딩 화면으로 잘못 리다이렉트되는 문제가 있었다. 조회 실패는 로그인 자체를
// 막을 이유가 아니므로 조용히 무시하고 기존 로컬 상태를 그대로 둔다.
export async function syncOnboardedStatus(): Promise<void> {
  try {
    const myProfileDto = await fetchMyProfile();
    const { profile, updateProfile } = useProfileStore.getState();
    updateProfile({ ...profile, isOnboarded: myProfileDto !== null });
  } catch {
    // 네트워크 실패 등은 무시한다.
  }
}
