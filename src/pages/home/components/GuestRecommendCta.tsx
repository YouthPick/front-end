interface GuestRecommendCtaProps {
  onGetRecommendations: () => void;
  onBrowseAll: () => void;
}

export function GuestRecommendCta({ onGetRecommendations, onBrowseAll }: GuestRecommendCtaProps) {
  return (
    <section className="rounded-3xl bg-gradient-to-br from-primary/[0.08] to-brand-secondary/[0.04] border border-primary/20 p-6 sm:p-8 text-left space-y-4">
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
          onClick={onGetRecommendations}
          className="rounded-xl bg-gradient-to-r from-primary to-brand-secondary px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/10 transition-all hover:brightness-105 active:scale-95 cursor-pointer"
        >
          내 조건에 맞는 정책 추천받기
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
