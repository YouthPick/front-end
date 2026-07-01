import { useCallback, useState } from "react";
import { useProfileOptions } from "./use-profile-options";
import { useProfilePersistence } from "./use-profile-persistence";
import type { UserProfile } from "./types";

export const DEFAULT_USER_PROFILE: UserProfile = {
  birthYear: 1998,
  region: "서울특별시",
  subRegion: "마포구",
  employmentStatus: "미취업·구직",
  educationStatus: "대학 졸업",
  interests: ["일자리", "교육"],
  keywords: ["교육지원", "인턴"],
};

interface UseProfileWizardParams {
  onComplete: () => void;
  onToast: (message: string, type?: "success" | "info" | "warning") => void;
}

export function useProfileWizard({ onComplete, onToast }: UseProfileWizardParams) {
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [profileSetupStep, setProfileSetupStep] = useState<number>(1);
  const [wizardProfile, setWizardProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [newKeywordInput, setNewKeywordInput] = useState<string>("");

  const {
    options: profileOptions,
    isLoading: isProfileOptionsLoading,
    isFallback: isProfileOptionsFallback,
    errorMessage: profileOptionsErrorMessage,
  } = useProfileOptions();

  const {
    isSaving: isProfileSaving,
    loadProfile,
    saveProfile,
  } = useProfilePersistence();

  const updateWizardProfile = useCallback((patch: Partial<UserProfile>) => {
    setWizardProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const startProfileSetup = useCallback(() => {
    setProfileSetupStep(1);
    setWizardProfile(userProfile);
  }, [userProfile]);

  const loadSavedProfile = useCallback(async (signal?: AbortSignal) => {
    const savedProfile = await loadProfile(signal);
    setUserProfile(savedProfile);
    setWizardProfile(savedProfile);
    return savedProfile;
  }, [loadProfile]);

  const handleWizardNext = useCallback(async () => {
    if (profileSetupStep < 3) {
      setProfileSetupStep((prev) => prev + 1);
      return;
    }

    try {
      const savedProfile = await saveProfile(wizardProfile);
      setUserProfile(savedProfile);
      setWizardProfile(savedProfile);
      onComplete();
      onToast("✨ 맞춤 프로필 설정 완료! 저장된 조건으로 추천 결과를 갱신했습니다.", "success");
    } catch (error: unknown) {
      setUserProfile({ ...wizardProfile });
      onComplete();
      const message = error instanceof Error ? error.message : null;
      onToast(
        `프로필 API 저장에 실패해 브라우저 상태로만 반영했습니다.${message ? ` (${message})` : ""}`,
        "warning",
      );
    }
  }, [onComplete, onToast, profileSetupStep, saveProfile, wizardProfile]);

  const handleWizardPrev = useCallback(() => {
    if (profileSetupStep > 1) {
      setProfileSetupStep((prev) => prev - 1);
    }
  }, [profileSetupStep]);

  const addKeyword = useCallback((keyword: string) => {
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword === "") return;
    if (wizardProfile.keywords.includes(trimmedKeyword)) {
      onToast("이미 추가된 키워드입니다.", "info");
      return;
    }
    if (wizardProfile.keywords.length >= profileOptions.maxKeywordCount) {
      onToast(`관심 키워드는 최대 ${profileOptions.maxKeywordCount}개까지 추가할 수 있습니다.`, "warning");
      return;
    }
    setWizardProfile((prev) => ({
      ...prev,
      keywords: [...prev.keywords, trimmedKeyword],
    }));
  }, [onToast, profileOptions.maxKeywordCount, wizardProfile.keywords]);

  const handleAddKeyword = useCallback(() => {
    addKeyword(newKeywordInput);
    setNewKeywordInput("");
  }, [addKeyword, newKeywordInput]);

  const handleRemoveKeyword = useCallback((keyword: string) => {
    setWizardProfile((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((item) => item !== keyword),
    }));
  }, []);

  const handleToggleInterest = useCallback((interest: string) => {
    if (wizardProfile.interests.includes(interest)) {
      setWizardProfile((prev) => ({
        ...prev,
        interests: prev.interests.filter((item) => item !== interest),
      }));
      return;
    }

    if (wizardProfile.interests.length >= profileOptions.maxInterestCount) {
      onToast(`관심 분야는 최대 ${profileOptions.maxInterestCount}개까지 선택할 수 있습니다.`, "warning");
      return;
    }

    setWizardProfile((prev) => ({
      ...prev,
      interests: [...prev.interests, interest],
    }));
  }, [onToast, profileOptions.maxInterestCount, wizardProfile.interests]);

  return {
    userProfile,
    profileSetupStep,
    wizardProfile,
    newKeywordInput,
    profileOptions,
    isProfileOptionsLoading,
    isProfileOptionsFallback,
    profileOptionsErrorMessage,
    isProfileSaving,
    setNewKeywordInput,
    updateWizardProfile,
    startProfileSetup,
    loadSavedProfile,
    handleWizardNext,
    handleWizardPrev,
    addKeyword,
    handleAddKeyword,
    handleRemoveKeyword,
    handleToggleInterest,
  };
}
