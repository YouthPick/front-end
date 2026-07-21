import { Skeleton } from '@/shared/ui';

import { useProfileSetupWizard } from '../hooks/useProfileSetupWizard';
import { ProfileSetupPresenter } from './ProfileSetupPresenter';

export function ProfileSetupContainer() {
  const {
    step,
    draft,
    canProceed,
    isEditMode,
    isLoading,
    isSubmitting,
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
  } = useProfileSetupWizard();

  // 수정 모드에서는 서버 프로필(및 지역 목록)을 불러온 뒤에야 draft를 정확히 채울 수 있다.
  // 로딩 중에 마법사를 먼저 그리면 빈 값으로 시작했다가 한 박자 뒤에 값이 튀어 보인다.
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <ProfileSetupPresenter
      step={step}
      draft={draft}
      canProceed={canProceed}
      isEditMode={isEditMode}
      isSubmitting={isSubmitting}
      newKeywordInput={newKeywordInput}
      onKeywordInputChange={setNewKeywordInput}
      onUpdateDraft={updateDraft}
      onToggleInterest={toggleInterest}
      onToggleSpecialCondition={toggleSpecialCondition}
      onAddKeyword={addKeyword}
      onRemoveKeyword={removeKeyword}
      onNext={goNext}
      onPrev={goPrev}
      onSkip={skip}
    />
  );
}
