import { useProfileSetupWizard } from '../hooks/useProfileSetupWizard';
import { ProfileSetupPresenter } from './ProfileSetupPresenter';

export function ProfileSetupContainer() {
  const {
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
    toggleSpecialCondition,
  } = useProfileSetupWizard();

  return (
    <ProfileSetupPresenter
      step={step}
      draft={draft}
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
