import type { SyncLog } from "../types/adminSync.types";

interface SyncHistoryTableProps {
  logs: SyncLog[];
}

export function SyncHistoryTable({ logs }: SyncHistoryTableProps) {
  return (
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
            {logs.map((log) => (
              <tr key={`${log.date}-${log.newCount}-${log.editCount}`} className="hover:bg-slate-50/50">
                <td className="py-3 px-3 font-semibold text-slate-700">{log.date}</td>
                <td className="py-3 px-3">
                  <span
                    className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-black ${
                      log.status === "SUCCESS"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
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
  );
}
