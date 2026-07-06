import { create } from "zustand";

import type { UserProfile } from "./user.types";

const DEFAULT_USER_PROFILE: UserProfile = {
  birthYear: 1998,
  region: "서울특별시",
  subRegion: "마포구",
  employmentStatus: "미취업·구직",
  educationStatus: "대학 졸업",
  interests: ["일자리", "교육"],
  keywords: ["직무교육", "면접비"],
};

interface ProfileStore {
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: DEFAULT_USER_PROFILE,
  updateProfile: (profile) => set({ profile }),
}));
