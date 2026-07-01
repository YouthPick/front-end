import { useCallback, useState } from "react";
import {
  fetchUserProfile,
  profileResponseToUserProfile,
  saveUserProfile,
} from "../api/profile-api";
import type { UserProfile } from "./types";

interface UseProfilePersistenceResult {
  isSaving: boolean;
  errorMessage: string | null;
  loadProfile: (signal?: AbortSignal) => Promise<UserProfile>;
  saveProfile: (profile: UserProfile) => Promise<UserProfile>;
}

export function useProfilePersistence(): UseProfilePersistenceResult {
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadProfile = useCallback(async (signal?: AbortSignal) => {
    setErrorMessage(null);
    try {
      const response = await fetchUserProfile(signal);
      return profileResponseToUserProfile(response);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "프로필 조회 API 호출에 실패했습니다.";
      setErrorMessage(message);
      throw error;
    }
  }, []);

  const saveProfile = useCallback(async (profile: UserProfile) => {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const response = await saveUserProfile(profile);
      return profileResponseToUserProfile(response);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "프로필 저장 API 호출에 실패했습니다.";
      setErrorMessage(message);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    isSaving,
    errorMessage,
    loadProfile,
    saveProfile,
  };
}
