import { Info } from "lucide-react";

export function NoticeBanner() {
  return (
    <section className="mt-12 rounded-3xl bg-blue-50/50 border border-blue-100 p-4.5 flex items-start space-x-3 text-left">
      <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-slate-800">알림 및 안내사항</h4>
        <p className="text-[11px] leading-relaxed text-slate-500">
          YouthPick의 청년복지 및 주거 일자리 지원 정보는 공공 API 데이터를 매 시간 대조하여 최신 상태로 유지되나, 실제 거주 조건이나 주관기관의 접수 마감 변동 시점에 따른 간차가 생길 수 있습니다.
          최종 승인은 세부 상세보기 링크의 주관 기관 공식 창구를 반드시 방문 검토하시기 권장합니다.
        </p>
      </div>
    </section>
  );
}
