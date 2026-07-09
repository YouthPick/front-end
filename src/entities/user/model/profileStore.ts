import { create } from 'zustand';

import type { UserProfile } from './user.types';

// isOnboarded가 false면 최초 로그인으로 간주해 프로필 설정 마법사로 안내한다.
const DEFAULT_USER_PROFILE: UserProfile = {
  birthYear: 1998,
  region: '서울특별시',
  subRegion: '마포구',
  employmentStatus: '미취업·구직',
  educationStatus: '대학 졸업',
  maritalStatus: '제한없음',
  major: '제한없음',
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
