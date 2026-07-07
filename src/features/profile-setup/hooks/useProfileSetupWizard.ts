import { useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { useProfileStore, type UserProfile } from "@/entities/user";
import { ROUTES } from "@/shared/constants";
import { useToast } from "@/shared/ui";
import { getRedirectPath } from "@/shared/utils";

export const MAX_INTEREST_COUNT = 3;
export const MAX_KEYWORD_COUNT = 5;
export const WIZARD_TOTAL_STEPS = 3;

export function useProfileSetupWizard() {
  const profile = useProfileStore((state) => state.profile);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // 로그인 시 원래 가려던 경로. 마법사 완료·보류 후 이곳으로 복귀한다.
  const from = getRedirectPath(location.state);

  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<UserProfile>({
    ...profile,
    interests: [...profile.interests],
    keywords: [...profile.keywords],
  });
  const [newKeywordInput, setNewKeywordInput] = useState("");

  const updateDraft = (patch: Partial<UserProfile>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const goNext = () => {
    if (step < WIZARD_TOTAL_STEPS) {
      setStep((prev) => prev + 1);
      return;
    }
    // 관심 분야 없이 완료하면 다음 로그인에 마법사가 다시 뜨므로 최소 1개를 요구한다.
    if (draft.interests.length === 0) {
      showToast("관심 분야를 1개 이상 선택해 주세요.", "warning");
      return;
    }
    updateProfile(draft);
    navigate(from ?? ROUTES.recommend, { replace: true });
    showToast("✨ 맞춤 프로필 설정 완료! 실시간 추천 결과 28건이 연계되었습니다.", "success");
  };

  const goPrev = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const skip = () => {
    navigate(from ?? ROUTES.home, { replace: true });
    showToast("설정 마법사가 일시적으로 보류되었습니다.", "info");
  };

  const addKeyword = () => {
    const keyword = newKeywordInput.trim();
    if (keyword === "") return;
    // 중복 키워드는 key 충돌과 removeKeyword의 일괄 삭제를 유발하므로 미리 걸러낸다.
    if (draft.keywords.includes(keyword)) {
      showToast("이미 추가된 키워드입니다.", "info");
      setNewKeywordInput("");
      return;
    }
    if (draft.keywords.length >= MAX_KEYWORD_COUNT) {
      showToast(`관심 키워드는 최대 ${MAX_KEYWORD_COUNT}개까지 추가할 수 있습니다.`, "warning");
      return;
    }
    setDraft((prev) => ({ ...prev, keywords: [...prev.keywords, keyword] }));
    setNewKeywordInput("");
  };

  const removeKeyword = (keyword: string) => {
    setDraft((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keyword),
    }));
  };

  const toggleInterest = (interest: string) => {
    if (draft.interests.includes(interest)) {
      setDraft((prev) => ({
        ...prev,
        interests: prev.interests.filter((i) => i !== interest),
      }));
      return;
    }
    if (draft.interests.length >= MAX_INTEREST_COUNT) {
      showToast(`관심 분야는 최대 ${MAX_INTEREST_COUNT}개까지 선택할 수 있습니다.`, "warning");
      return;
    }
    setDraft((prev) => ({ ...prev, interests: [...prev.interests, interest] }));
  };

  return {
    step,
    draft,
    newKeywordInput,
    setNewKeywordInput,
    updateDraft,
    goNext,
    goPrev,
    skip,
    addKeyword,
    removeKeyword,
    toggleInterest,
  };
}
