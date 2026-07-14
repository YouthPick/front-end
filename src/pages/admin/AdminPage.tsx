import { Loader2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router';

import { AdminQaNote, SyncSummaryCards, useRunSync } from '@/features/admin-sync';
import { ROUTES } from '@/shared/constants';

export function AdminPage() {
  const { runSync, isSyncing } = useRunSync();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left">
        <div>
          <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider">
            YouthPick 백엔드 콘솔
          </span>
          <h2 className="text-lg font-black text-slate-800">운영사 대시보드</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            실시간 공공 API 연동 품질 상태 모니터링 및 동기화 무결성을 검사합니다.
          </p>
        </div>

        {/* Manual sync command */}
        <button
          type="button"
          disabled={isSyncing}
          onClick={runSync}
          className="inline-flex items-center space-x-1.5 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-700 disabled:opacity-50 transition-all cursor-pointer"
        >
          {isSyncing ? (
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

      <SyncSummaryCards />

      <Link
        to={ROUTES.adminLogsBatch}
        className="block rounded-3xl border border-slate-100 bg-white p-5 text-left shadow-sm hover:bg-slate-50"
      >
        <h4 className="text-xs font-extrabold text-slate-800">배치 작업 로그 전체 보기</h4>
        <p className="mt-1 text-xs text-slate-400">
          공공데이터 동기화 이력을 필터·페이지네이션과 함께 확인합니다. →
        </p>
      </Link>

      <AdminQaNote />
    </div>
  );
}
