const SUMMARY_CARDS = [
  {
    label: "전국 활성 청년정책",
    value: "3,241건",
    valueClass: "text-slate-800",
    note: "✓ API 정상 수신 완료",
    noteClass: "text-emerald-500",
  },
  {
    label: "원본 URL 파손 누락",
    value: "12건",
    valueClass: "text-amber-600",
    note: "메모 유지/백업 카드 노출 중",
    noteClass: "text-slate-400",
  },
  {
    label: "신청기간 날짜 파싱오류",
    value: "18건",
    valueClass: "text-rose-500",
    note: "⚠️ 수동 입력 보정 대기",
    noteClass: "text-rose-400",
  },
  {
    label: "공공 DB 접속 실패 수",
    value: "2건",
    valueClass: "text-slate-400",
    note: "전회차 크롤러 캐시 가동",
    noteClass: "text-slate-400",
  },
];

export function SyncSummaryCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {SUMMARY_CARDS.map((card) => (
        <div key={card.label} className="rounded-2xl border border-slate-100 bg-white p-4.5 text-left shadow-sm">
          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            {card.label}
          </span>
          <span className={`text-xl font-black block mt-1 ${card.valueClass}`}>{card.value}</span>
          <span className={`text-[9px] font-bold mt-1 block ${card.noteClass}`}>{card.note}</span>
        </div>
      ))}
    </div>
  );
}
