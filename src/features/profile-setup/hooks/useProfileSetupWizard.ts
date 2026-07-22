import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { policyKeys } from '@/entities/policy';
import { usePublicRegionsQuery } from '@/entities/region';
import {
  mapMyProfileResponse,
  myProfileKeys,
  type OnboardingProfileRequestDto,
  submitOnboardingProfile,
  type UserProfile,
  updateOnboardingProfile,
  useAuthStore,
  useMyProfileQuery,
  useProfileStore,
} from '@/entities/user';
import { ROUTES } from '@/shared/constants';
import { useToast } from '@/shared/ui';
import { getRedirectPath, hasEditIntent } from '@/shared/utils';

import { buildOnboardingRequest } from '../model/buildOnboardingRequest';
import { getOnboardingErrorMessage } from '../model/onboardingErrors';

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
  const userId = useAuthStore((state) => state.user?.id);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  // WizardStepBasic도 같은 쿼리를 구독하므로 캐시를 공유해 중복 요청이 나가지 않는다.
  const { data: regions = [], isLoading: isRegionsLoading } = usePublicRegionsQuery();
  // "프로필 수정"은 이 마법사를 그대로 재사용한다 — 이미 서버에 프로필이 있으면 수정 모드로 동작한다.
  const { data: myProfileDto, isLoading: isMyProfileLoading } = useMyProfileQuery();
  const isEditMode = myProfileDto !== undefined && myProfileDto !== null;

  // 로그인 시 원래 가려던 경로. 마법사 완료·보류 후 이곳으로 복귀한다.
  const from = getRedirectPath(location.state);
  // 마이페이지 "수정" 버튼처럼 명시적으로 들어온 게 아니면(URL 직접 입력, 북마크, 뒤로가기 등)
  // 이미 온보딩을 완료한 사용자를 굳이 이 페이지에 머물게 하지 않는다.
  const editIntent = hasEditIntent(location.state);
  const isDataLoading = isMyProfileLoading || isRegionsLoading;
  const shouldRedirectHome = !isDataLoading && isEditMode && !editIntent;

  useEffect(() => {
    if (shouldRedirectHome) {
      navigate(ROUTES.home, { replace: true });
    }
  }, [shouldRedirectHome, navigate]);

  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<UserProfile>({
    ...profile,
    specialConditions: [...profile.specialConditions],
    interests: [...profile.interests],
    keywords: [...profile.keywords],
  });
  const [newKeywordInput, setNewKeywordInput] = useState('');

  // 수정 모드로 진입했을 때만 서버 프로필로 draft를 다시 채운다. myProfileDto/regions 쿼리가
  // 비동기로 늦게 채워지므로 useState 초기값(로컬 profile 스토어 기준)만으로는 기존 값이 반영되지 않는다.
  useEffect(() => {
    if (!myProfileDto) return;
    setDraft(mapMyProfileResponse(myProfileDto, regions));
  }, [myProfileDto, regions]);

  const submitMutation = useMutation({
    mutationFn: ({ userId, request }: { userId: string; request: OnboardingProfileRequestDto }) =>
      isEditMode ? updateOnboardingProfile(request) : submitOnboardingProfile(userId, request),
  });

  const updateDraft = (patch: Partial<UserProfile>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const canProceed = isStepComplete(step, draft);

  const goNext = async () => {
    // 버튼이 비활성화돼 있어 정상 흐름에서는 도달하지 않지만, 방어적으로 한 번 더 막는다.
    if (!canProceed) return;

    if (step < WIZARD_TOTAL_STEPS) {
      setStep((prev) => prev + 1);
      return;
    }

    if (!userId) {
      showToast('로그인이 필요한 기능입니다. 다시 로그인한 뒤 이용해 주세요.', 'warning');
      return;
    }

    // 결혼상태·전공·특화조건·연소득·관심분야는 모두 선택 항목이라, 비워 두면 매칭 시 제한없음으로 간주한다.
    const request = buildOnboardingRequest(draft, regions);
    if (!request) {
      showToast('거주 지역을 다시 선택해 주세요.', 'warning');
      setStep(1);
      return;
    }

    try {
      await submitMutation.mutateAsync({ userId, request });
      updateProfile({ ...draft, isOnboarded: true });
      // invalidate가 아니라 remove인 이유: 방금 프로필을 바꿨으므로 캐시에 남은 값은 "오래된" 게 아니라
      // 틀린 데이터다. invalidate는 재조회 동안 이전 값을 그대로 노출해 잘못된 추천이 1초쯤 보이고,
      // 그렇다고 isFetching으로 스켈레톤을 걸면 탭 복귀 등 평범한 백그라운드 갱신 때도 화면이 깜빡인다.
      // 캐시를 비우면 다음 마운트가 최초 로딩이 되어 기존 스켈레톤 처리가 그대로 동작한다.
      queryClient.removeQueries({ queryKey: myProfileKeys.all });
      queryClient.removeQueries({ queryKey: policyKeys.recommended });
      navigate(from ?? ROUTES.recommend, { replace: true });
      showToast(
        isEditMode
          ? '프로필이 수정되었습니다.'
          : '✨ 맞춤 프로필 설정 완료! 실시간 추천 결과를 확인해보세요.',
        'success',
      );
    } catch (error) {
      showToast(
        getOnboardingErrorMessage(error, '프로필 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.'),
        'warning',
      );
    }
  };

  const goPrev = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const skip = () => {
    // 프로필 수정 중 취소는 원래 화면(마이페이지)으로 돌아간다.
    if (isEditMode) {
      navigate(from ?? ROUTES.my, { replace: true });
      return;
    }
    // 원래 가려던 경로(from)가 온보딩을 요구하는 화면(예: 맞춤 추천)이면 그리로 돌아가는 순간
    // 다시 마법사로 튕기므로, 최초 온보딩의 스킵은 항상 홈으로 보낸다.
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
    isEditMode,
    isLoading: isDataLoading || shouldRedirectHome,
    isSubmitting: submitMutation.isPending,
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
