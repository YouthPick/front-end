import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { type UserProfile, useProfileStore } from '@/entities/user';
import { ROUTES } from '@/shared/constants';
import { useToast } from '@/shared/ui';
import { getRedirectPath } from '@/shared/utils';

export const MAX_INTEREST_COUNT = 3;
export const MAX_KEYWORD_COUNT = 5;
export const WIZARD_TOTAL_STEPS = 4;

// 출생연도·거주지역(1단계)·취업상태·학력(2단계)은 필수값이다. 나머지 단계는 전부 선택이라 항상 통과시킨다.
function isStepComplete(step: number, draft: UserProfile): boolean {
  if (step === 1) return draft.birthYear !== 0 && draft.region !== '';
  if (step === 2) return draft.employmentStatus !== '' && draft.educationStatus !== '';
  return true;
}

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
    specialConditions: [...profile.specialConditions],
    interests: [...profile.interests],
    keywords: [...profile.keywords],
  });
  const [newKeywordInput, setNewKeywordInput] = useState('');

  const updateDraft = (patch: Partial<UserProfile>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const canProceed = isStepComplete(step, draft);

  const goNext = () => {
    // 버튼이 비활성화돼 있어 정상 흐름에서는 도달하지 않지만, 방어적으로 한 번 더 막는다.
    if (!canProceed) return;

    if (step < WIZARD_TOTAL_STEPS) {
      setStep((prev) => prev + 1);
      return;
    }
    // 결혼상태·전공·특화조건·연소득·관심분야는 모두 선택 항목이라, 비워 두면 매칭 시 제한없음으로 간주한다.
    updateProfile({ ...draft, isOnboarded: true });
    navigate(from ?? ROUTES.recommend, { replace: true });
    showToast('✨ 맞춤 프로필 설정 완료! 실시간 추천 결과를 확인해보세요.', 'success');
  };

  const goPrev = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const skip = () => {
    // 원래 가려던 경로(from)가 온보딩을 요구하는 화면(예: 맞춤 추천)이면 그리로 돌아가는 순간
    // 다시 마법사로 튕기므로, 스킵은 항상 홈으로 보낸다.
    navigate(ROUTES.home, { replace: true });
  };

  const addKeyword = () => {
    const keyword = newKeywordInput.trim();
    if (keyword === '') return;
    // 중복 키워드는 key 충돌과 removeKeyword의 일괄 삭제를 유발하므로 미리 걸러낸다.
    if (draft.keywords.includes(keyword)) {
      showToast('이미 추가된 키워드입니다.', 'info');
      setNewKeywordInput('');
      return;
    }
    if (draft.keywords.length >= MAX_KEYWORD_COUNT) {
      showToast(`관심 키워드는 최대 ${MAX_KEYWORD_COUNT}개까지 추가할 수 있습니다.`, 'warning');
      return;
    }
    setDraft((prev) => ({ ...prev, keywords: [...prev.keywords, keyword] }));
    setNewKeywordInput('');
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
      showToast(`관심 분야는 최대 ${MAX_INTEREST_COUNT}개까지 선택할 수 있습니다.`, 'warning');
      return;
    }
    setDraft((prev) => ({ ...prev, interests: [...prev.interests, interest] }));
  };

  const toggleSpecialCondition = (condition: string) => {
    setDraft((prev) => ({
      ...prev,
      specialConditions: prev.specialConditions.includes(condition)
        ? prev.specialConditions.filter((c) => c !== condition)
        : [...prev.specialConditions, condition],
    }));
  };

  return {
    step,
    draft,
    canProceed,
    newKeywordInput,
    setNewKeywordInput,
    updateDraft,
    goNext,
    goPrev,
    skip,
    addKeyword,
    removeKeyword,
    toggleInterest,
    toggleSpecialCondition,
  };
}
