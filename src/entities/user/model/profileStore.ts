import { create } from 'zustand';

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
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: DEFAULT_USER_PROFILE,
  updateProfile: (profile) => set({ profile }),
}));
