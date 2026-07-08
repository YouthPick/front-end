export function AdminQaNote() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 text-left space-y-3 shadow-sm">
      <h4 className="text-xs font-extrabold text-slate-800">품질 경고 사후 피드백 통제</h4>
      <p className="text-xs text-slate-500 leading-relaxed">
        파싱 오류나 원본 URL 누락 발생 시, YouthPick 캐시엔진이 저장한 최종 공고본 정보를
        사용자들에게 대체 제공하여 기 구축해둔 마이페이지 체크리스트를 계속 유지하게 설계되었습니다.
      </p>
    </div>
  );
}
