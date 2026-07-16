import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { UserProfile } from './user.types';

// isOnboarded가 false면 최초 로그인으로 간주해 프로필 설정 마법사로 안내한다.
// 필수 항목(birthYear·region·employmentStatus·educationStatus)은 실제 값처럼 보이는 데모 기본값 대신
// 빈 값(0/'')으로 두어 온보딩에서 아무것도 선택하지 않은 상태로 시작하게 한다. 마법사가 선택을 강제한다.
const DEFAULT_USER_PROFILE: UserProfile = {
  birthYear: 0,
  region: '',
  subRegion: '',
  employmentStatus: '',
  educationStatus: '',
  maritalStatus: '',
  major: '',
  specialConditions: [],
  annualIncome: null,
  incomeUnknown: false,
  interests: [],
  keywords: [],
  isOnboarded: false,
};

interface ProfileStore {
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => void;
  resetProfile: () => void;
}

// 백엔드에 프로필 조회/저장 API(GET·PUT /v1/me/profile)가 아직 없어 서버 하이드레이션이 불가능하다.
// 새로고침·소셜 로그인 풀 리다이렉트로 앱이 새로 마운트돼도 온보딩 상태가 유지되도록 localStorage에
// persist한다. 기기 공용 브라우저에서 다른 사용자로 로그인하면 이전 프로필이 남지 않도록 logout 시
// authStore가 resetProfile을 호출해 초기화한다.
export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: DEFAULT_USER_PROFILE,
      updateProfile: (profile) => set({ profile }),
      resetProfile: () => set({ profile: DEFAULT_USER_PROFILE }),
    }),
    { name: 'bop.profile' },
  ),
);
