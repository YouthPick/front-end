// 비로그인 사용자와 온보딩 미완료 사용자가 공유하는 맞춤 추천 진입 CTA.
// 두 경우 모두 "아직 프로필이 없어 추천을 못 준다"는 상태라 문구와 레이아웃이 같고,
// 이동 목적지(로그인 / 프로필 설정)만 호출부가 정한다.
const DEFAULT_PRIMARY_LABEL = '내 조건에 맞는 정책 추천받기';

interface RecommendSetupCtaProps {
  primaryLabel?: string;
  onStartRecommend: () => void;
  onBrowseAll: () => void;
}

export function RecommendSetupCta({
  primaryLabel = DEFAULT_PRIMARY_LABEL,
  onStartRecommend,
  onBrowseAll,
}: RecommendSetupCtaProps) {
  return (
    <section
      aria-label="맞춤 추천 시작 안내"
      className="rounded-3xl bg-gradient-to-br from-primary/[0.08] to-brand-secondary/[0.04] border border-primary/20 p-6 sm:p-8 text-left space-y-4"
    >
      <div className="max-w-2xl space-y-1.5">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-0.5 text-[10px] font-extrabold text-primary uppercase tracking-wider">
          스마트 맞춤 추천 서비스
        </span>
        <h3 className="text-base sm:text-lg font-black text-slate-800 leading-tight">
          프로필을 딱 한 번만 입력하고, 나에게 꼭 맞는 청년 정책을 받아보세요!
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          거주지역, 연령뿐만 아니라 상세한 취업상태, 학력, 관심 키워드 조건을 대조하여 복잡한
          수령자격을 자동으로 비교 분석해 드립니다.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        <button
          type="button"
          onClick={onStartRecommend}
          className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/10 transition-all hover:brightness-105 active:scale-95 cursor-pointer"
        >
          {primaryLabel}
        </button>
        <button
          type="button"
          onClick={onBrowseAll}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50"
        >
          일반 정책 전체 탐색
        </button>
      </div>
    </section>
  );
}
