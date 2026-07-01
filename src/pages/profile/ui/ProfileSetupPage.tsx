import type { ProfileOptions, UserProfile } from "@entities/user";

interface ProfileSetupPageProps {
  profileSetupStep: number;
  wizardProfile: UserProfile;
  newKeywordInput: string;
  profileOptions: ProfileOptions;
  isProfileOptionsLoading: boolean;
  isProfileOptionsFallback: boolean;
  profileOptionsErrorMessage: string | null;
  isProfileSaving: boolean;
  onUpdateWizardProfile: (patch: Partial<UserProfile>) => void;
  onNewKeywordInputChange: (value: string) => void;
  onToggleInterest: (interest: string) => void;
  onAddKeywordSuggestion: (keyword: string) => void;
  onAddKeyword: () => void;
  onRemoveKeyword: (keyword: string) => void;
  onWizardPrev: () => void;
  onWizardNext: () => void;
  onSkip: () => void;
}

export function ProfileSetupPage({
  profileSetupStep,
  wizardProfile,
  newKeywordInput,
  profileOptions,
  isProfileOptionsLoading,
  isProfileOptionsFallback,
  profileOptionsErrorMessage,
  isProfileSaving,
  onUpdateWizardProfile,
  onNewKeywordInputChange,
  onToggleInterest,
  onAddKeywordSuggestion,
  onAddKeyword,
  onRemoveKeyword,
  onWizardPrev,
  onWizardNext,
  onSkip,
}: ProfileSetupPageProps) {
  return (
<div className="animate-in fade-in duration-300 max-w-xl mx-auto py-6">
  <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 text-left space-y-6 shadow-sm">
    
    {/* Wizard progress bar */}
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-bold text-slate-400">
        <span className="text-primary font-black">맞춤 조건 분석 프로필 설정</span>
        <span>{profileSetupStep} / 3 단계</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${(profileSetupStep / 3) * 100}%` }}
        />
      </div>
    </div>

    <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
      {isProfileOptionsLoading && (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-500">프로필 선택지 불러오는 중</span>
      )}
      {isProfileOptionsFallback && (
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-600">
          기본 선택지 사용 중{profileOptionsErrorMessage ? ` · ${profileOptionsErrorMessage}` : ""}
        </span>
      )}
    </div>

    {/* STEP 1: 기본 조건 (PROFILE-01) */}
    {profileSetupStep === 1 && (
      <div className="space-y-5 animate-in fade-in duration-200">
        <div className="space-y-1">
          <h3 className="text-base font-black text-slate-800">1. 기본 조건을 알려주세요</h3>
          <p className="text-xs text-slate-400">전국 및 관내 거주 청년에게 제한 지급되는 수혜 나이 조건을 매칭 분석하는 기초 데이터입니다.</p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500">출생연도</label>
          <select
            value={wizardProfile.birthYear}
            onChange={(e) => onUpdateWizardProfile({ birthYear: parseInt(e.target.value) })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 outline-none"
          >
            {Array.from({ length: 25 }, (_, i) => 1988 + i).map((year) => (
              <option key={year} value={year}>{year}년생 (만 {2026 - year}세)</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-500">거주 광역시·도</label>
            <select
              value={wizardProfile.region}
              onChange={(e) => onUpdateWizardProfile({ region: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 outline-none"
            >
              {profileOptions.regions.map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-500">거주 시·군·구 (선택)</label>
            <select
              value={wizardProfile.subRegion}
              onChange={(e) => onUpdateWizardProfile({ subRegion: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 outline-none"
            >
              <option value="마포구">마포구</option>
              <option value="분당구">분당구</option>
              <option value="해운대구">해운대구</option>
              <option value="남동구">남동구</option>
              <option value="기타">기타 전체</option>
            </select>
          </div>
        </div>
        <p className="text-[10px] text-slate-400">※ 시군구 조건이 맞지 않더라도 전국 및 광역시 통합 우대 조건은 누락 없이 분석 매치해 드립니다.</p>
      </div>
    )}

    {/* STEP 2: 취업·학력 상태 (PROFILE-02) */}
    {profileSetupStep === 2 && (
      <div className="space-y-5 animate-in fade-in duration-200">
        <div className="space-y-1">
          <h3 className="text-base font-black text-slate-800">2. 현재 라이프스타일 및 자격상태</h3>
          <p className="text-xs text-slate-400">고용상태 및 졸업 학력 요건은 청년지원 제도의 가장 강력한 승인 잣대 조건입니다.</p>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider">현재 취업 고용 상태</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {profileOptions.employmentStatuses.map((status) => {
              const isSelected = wizardProfile.employmentStatus === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => onUpdateWizardProfile({ employmentStatus: status })}
                  className={`rounded-xl border py-2.5 text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary border-primary text-white shadow-sm"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider">최종 학력 상태</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {profileOptions.educationLevels.map((edu) => {
              const isSelected = wizardProfile.educationStatus === edu;
              return (
                <button
                  key={edu}
                  type="button"
                  onClick={() => onUpdateWizardProfile({ educationStatus: edu })}
                  className={`rounded-xl border py-2.5 text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary border-primary text-white shadow-sm"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {edu}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    )}

    {/* STEP 3: 관심 분야 & 키워드 (PROFILE-03) */}
    {profileSetupStep === 3 && (
      <div className="space-y-5 animate-in fade-in duration-200">
        <div className="space-y-1">
          <h3 className="text-base font-black text-slate-800">3. 관심 분야 및 검색 태그 키워드</h3>
          <p className="text-xs text-slate-400">수천 개의 정책 중 매칭 우선순위를 높이기 위한 사용자 가중치 조절 장치입니다.</p>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider">관심 사업 카테고리 (최대 {profileOptions.maxInterestCount}개)</label>
          <div className="flex flex-wrap gap-1.5">
            {profileOptions.categories.map((category) => {
              const isSelected = wizardProfile.interests.includes(category);
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => onToggleInterest(category)}
                  className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary border-primary text-white"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider">추가 타겟 키워드 (최대 {profileOptions.maxKeywordCount}개)</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="예: 교육지원, 주거지원, 보조금 등"
              value={newKeywordInput}
              onChange={(e) => onNewKeywordInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAddKeyword();
                }
              }}
              className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:outline-none focus:border-primary"
            />
            <button
              onClick={onAddKeyword}
              className="rounded-xl bg-slate-800 text-white px-4 py-2 text-xs font-bold hover:bg-slate-700"
            >
              추가
            </button>
          </div>

          <div className="flex flex-wrap gap-1 pt-1">
            {profileOptions.keywords.map((keyword) => {
              const isSelected = wizardProfile.keywords.includes(keyword);
              return (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => onAddKeywordSuggestion(keyword)}
                  disabled={isSelected}
                  className={`rounded-full border px-2.5 py-1 text-[10px] font-bold transition-colors ${
                    isSelected
                      ? "border-primary/20 bg-primary/10 text-primary"
                      : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  #{keyword}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-1 pt-1">
            {wizardProfile.keywords.map((kw) => (
              <span 
                key={kw} 
                className="inline-flex items-center space-x-1 rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1 text-xs font-extrabold text-primary"
              >
                <span>#{kw}</span>
                <button 
                  onClick={() => onRemoveKeyword(kw)} 
                  className="text-primary hover:text-red-500 font-extrabold ml-1 shrink-0"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    )}

    {/* Wizard Action Footer */}
    <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-4">
      {profileSetupStep > 1 ? (
        <button
          onClick={onWizardPrev}
          className="rounded-xl border border-slate-200 bg-white px-4.5 py-2.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50"
        >
          이전 단계로
        </button>
      ) : (
        <button
          onClick={onSkip}
          className="rounded-xl border border-slate-200 bg-white px-4.5 py-2.5 text-xs font-bold text-slate-400 hover:text-slate-600"
        >
          나중에 하기
        </button>
      )}

      <button
        onClick={() => void onWizardNext()}
        disabled={isProfileSaving}
        className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:brightness-105 active:scale-95 disabled:cursor-wait disabled:opacity-70"
      >
        {isProfileSaving ? "프로필 저장 중..." : profileSetupStep === 3 ? "맞춤 추천목록 확인" : "다음 단계로"}
      </button>
    </div>

  </div>
</div>
  );
}
