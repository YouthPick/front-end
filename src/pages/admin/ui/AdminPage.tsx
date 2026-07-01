import { Loader2, RefreshCw } from "lucide-react";
import type { AdminMetricsDto, AdminSyncLog } from "@features/admin-sync";

interface AdminPageProps {
  adminMetrics: AdminMetricsDto;
  syncHistory: AdminSyncLog[];
  isAdminSyncHistoryLoading: boolean;
  isAdminMetricsLoading: boolean;
  isAdminSyncFallback: boolean;
  isAdminMetricsFallback: boolean;
  adminSyncErrorMessage: string | null;
  adminMetricsErrorMessage: string | null;
  isAdminSyncing: boolean;
  isSearchIndexRebuilding: boolean;
  onRunAdminSync: () => void;
  onRunSearchIndexRebuild: () => void;
}

export function AdminPage({
  adminMetrics,
  syncHistory,
  isAdminSyncHistoryLoading,
  isAdminMetricsLoading,
  isAdminSyncFallback,
  isAdminMetricsFallback,
  adminSyncErrorMessage,
  adminMetricsErrorMessage,
  isAdminSyncing,
  isSearchIndexRebuilding,
  onRunAdminSync,
  onRunSearchIndexRebuild,
}: AdminPageProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left">
        <div>
          <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider">YouthPick 백엔드 콘솔</span>
          <h2 className="text-lg font-black text-slate-800">운영사 대시보드</h2>
          <p className="text-xs text-slate-400 mt-0.5">실시간 공공 API 연동 품질 상태 모니터링 및 동기화 무결성을 검사합니다.</p>
          <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-bold">
            {isAdminSyncHistoryLoading && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-500">이력 API 조회 중</span>
            )}
            {isAdminMetricsLoading && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-500">운영 지표 API 조회 중</span>
            )}
            {adminSyncErrorMessage && (
              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-rose-600">
                서버 이력 로드 실패 · {adminSyncErrorMessage}
              </span>
            )}
            {adminMetricsErrorMessage && (
              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-rose-600">
                서버 지표 로드 실패 · {adminMetricsErrorMessage}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            disabled={isSearchIndexRebuilding}
            onClick={onRunSearchIndexRebuild}
            className="inline-flex items-center justify-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isSearchIndexRebuilding ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                <span>검색 인덱스 재생성 요청 중...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-3.5 w-3.5" />
                <span>검색 인덱스 재생성</span>
              </>
            )}
          </button>
          <button
            disabled={isAdminSyncing}
            onClick={onRunAdminSync}
            className="inline-flex items-center justify-center space-x-1.5 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-700 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isAdminSyncing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>실시간 파싱 및 무결성 정합 중...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-3.5 w-3.5" />
                <span>정기 공고 데이터 수동 강제 동기화</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-4.5 text-left shadow-sm">
          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">전체 정책 / 공개 정책</span>
          <span className="text-xl font-black text-slate-800 block mt-1">
            {adminMetrics.policy.totalCount.toLocaleString()}건
          </span>
          <span className="text-[9px] text-emerald-500 font-bold mt-1 block">
            ✓ 공개 {adminMetrics.policy.exposedCount.toLocaleString()}건 · 활성 {adminMetrics.policy.activeCount.toLocaleString()}건
          </span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4.5 text-left shadow-sm">
          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">원본 URL 파손 누락</span>
          <span className="text-xl font-black text-amber-600 block mt-1">
            {adminMetrics.policy.missingReferenceUrlCount.toLocaleString()}건
          </span>
          <span className="text-[9px] text-slate-400 font-bold mt-1 block">공개 정책 기준 공식 링크 누락</span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4.5 text-left shadow-sm">
          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">사용자 활동 이벤트</span>
          <span className="text-xl font-black text-primary block mt-1">
            {(adminMetrics.user.favoriteCount + adminMetrics.user.readStateCount).toLocaleString()}건
          </span>
          <span className="text-[9px] text-slate-400 font-bold mt-1 block">
            프로필 {adminMetrics.user.profileCount.toLocaleString()} · 관심 {adminMetrics.user.favoriteCount.toLocaleString()} · 읽음 {adminMetrics.user.readStateCount.toLocaleString()}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4.5 text-left shadow-sm">
          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">동기화 실패 / 실행중</span>
          <span className="text-xl font-black text-slate-800 block mt-1">
            {adminMetrics.sync.failedJobCount.toLocaleString()}건 / {adminMetrics.sync.runningJobCount.toLocaleString()}건
          </span>
          <span className="text-[9px] text-slate-400 font-bold mt-1 block">
            최근 상태 {adminMetrics.sync.lastJobStatus ?? "이력 없음"} · 오류 {adminMetrics.sync.lastJobErrorCount.toLocaleString()}건
          </span>
        </div>
      </div>

      <div className="rounded-3xl bg-white border border-slate-100 p-5 text-left space-y-4 shadow-sm">
        <h4 className="text-xs font-extrabold text-slate-800">최근 공공데이터 동기화 이력 로그</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-slate-500">
            <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-3 text-left">일시</th>
                <th className="py-2.5 px-3 text-left">수신 상태</th>
                <th className="py-2.5 px-3 text-right">신규 등재</th>
                <th className="py-2.5 px-3 text-right">기존 변경</th>
                <th className="py-2.5 px-3 text-right">원본 누락</th>
                <th className="py-2.5 px-3 text-right">경고/오류</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {syncHistory.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs font-bold text-slate-400">
                    {adminSyncErrorMessage ? "서버 동기화 이력을 불러오지 못했습니다." : "서버 동기화 이력이 없습니다."}
                  </td>
                </tr>
              )}
              {syncHistory.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3 font-semibold text-slate-700">{log.date}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-black ${
                      log.status === "SUCCESS" || log.status === "SUCCEEDED"
                        ? "bg-emerald-50 text-emerald-600"
                        : log.status === "FAILED"
                          ? "bg-rose-50 text-rose-600"
                          : "bg-amber-50 text-amber-600"
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-700">+{log.newCount}</td>
                  <td className="py-3 px-3 text-right font-medium">{log.editCount}</td>
                  <td className="py-3 px-3 text-right text-amber-600 font-bold">{log.missingCount}</td>
                  <td className="py-3 px-3 text-right text-rose-500 font-bold">{log.errorCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-5 text-left space-y-3 shadow-sm">
        <h4 className="text-xs font-extrabold text-slate-800">품질 경고 사후 피드백 통제</h4>
        <p className="text-xs text-slate-500 leading-relaxed">
          파싱 오류나 원본 URL 누락 발생 시, YouthPick 캐시엔진이 저장한 최종 공고본 정보를 사용자들에게 대체 제공하여 기 구축해둔 마이페이지 체크리스트를 계속 유지하게 설계되었습니다.
        </p>
      </div>
    </div>
  );
}
