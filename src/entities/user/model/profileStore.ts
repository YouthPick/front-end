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
  // 마지막으로 이 프로필을 소유했던 사용자. 기기 공용 브라우저에서 다른 사용자가 로그인했을 때
  // authStore가 이 값과 비교해 이전 사용자의 온보딩 상태를 물려받지 않도록 판단하는 데 쓴다.
  userId: string | null;
  updateProfile: (profile: UserProfile) => void;
  resetProfile: () => void;
  setUserId: (userId: string) => void;
}

interface PersistedProfileState {
  isOnboarded: boolean;
  userId: string | null;
}

function isPersistedProfileState(value: unknown): value is PersistedProfileState {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { isOnboarded?: unknown }).isOnboarded === 'boolean'
  );
}

// 백엔드에 프로필 조회/저장 API(GET·PUT /v1/me/profile)가 아직 없어 서버 하이드레이션이 불가능하다.
// 새로고침·소셜 로그인 풀 리다이렉트로 앱이 새로 마운트돼도 온보딩 상태가 유지되도록 localStorage에
// persist하되, birthYear·region·annualIncome 등 민감할 수 있는 나머지 프로필 필드는 세션(메모리)
// 동안만 유지하고 isOnboarded/userId만 저장한다(AUTH-GR-002와 동일하게 브라우저 저장소에 민감정보를
// 남기지 않는다). 기기 공용 브라우저에서 다른 사용자로 로그인하면 이전 프로필이 남지 않도록 authStore가
// userId 불일치를 감지해 resetProfile을 호출한다.
export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: DEFAULT_USER_PROFILE,
      userId: null,
      updateProfile: (profile) => set({ profile }),
      resetProfile: () => set({ profile: DEFAULT_USER_PROFILE, userId: null }),
      setUserId: (userId) => set({ userId }),
    }),
    {
      name: 'bop.profile',
      partialize: (state) => ({ isOnboarded: state.profile.isOnboarded, userId: state.userId }),
      merge: (persisted, current) => {
        if (!isPersistedProfileState(persisted)) return current;
        return {
          ...current,
          userId: persisted.userId,
          profile: { ...current.profile, isOnboarded: persisted.isOnboarded },
        };
      },
    },
  ),
);
