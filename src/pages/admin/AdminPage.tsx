import { Loader2, RefreshCw } from 'lucide-react';

import {
  AdminQaNote,
  SyncHistoryTable,
  SyncSummaryCards,
  useRunSync,
  useSyncHistory,
} from '@/features/admin-sync';
import { ErrorState, Skeleton } from '@/shared/ui';

export function AdminPage() {
  const { data: syncHistory = [], isLoading, isError, refetch } = useSyncHistory();
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

      {isLoading && <Skeleton className="h-48" />}

      {isError && (
        <ErrorState title="동기화 이력을 불러오지 못했습니다" onRetry={() => refetch()} />
      )}

      {!isLoading && !isError && <SyncHistoryTable logs={syncHistory} />}

      <AdminQaNote />
    </div>
  );
}
