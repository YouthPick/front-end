import { AlertTriangle, CheckSquare, ChevronRight, Plus, Square, Trash2 } from "lucide-react";
import type { Policy } from "@entities/policy";
import type { TrackerItem } from "@entities/tracker";

type TrackerStatus = TrackerItem["status"];

const TRACKER_TABS: Array<"전체" | TrackerStatus> = [
  "전체",
  "관심",
  "준비중",
  "신청완료",
  "결과대기",
  "종료",
];
const TRACKER_STATUS_OPTIONS: TrackerStatus[] = ["관심", "준비중", "신청완료", "결과대기", "종료"];

interface TrackerDashboardProps {
  trackers: TrackerItem[];
  trackerTab: string;
  selectedTrackerPolicyId: string | null;
  activeTrackerItem: TrackerItem | null;
  activeTrackerPolicy: Policy | null;
  showAddChecklistItem: boolean;
  newChecklistItemText: string;
  tempMemoText: string;
  showDeleteTrackerConfirm: string | null;
  onTrackerTabChange: (tab: string) => void;
  onSelectTrackerPolicy: (policyId: string) => void;
  onStatusChange: (policyId: string, status: TrackerStatus) => void;
  onTargetDateChange: (policyId: string, date: string) => void;
  onOpenAddChecklistItem: () => void;
  onCancelAddChecklistItem: () => void;
  onNewChecklistItemTextChange: (text: string) => void;
  onAddChecklistItem: () => void;
  onToggleChecklistItem: (policyId: string, itemId: string) => void;
  onDeleteChecklistItem: (policyId: string, itemId: string) => void;
  onTempMemoTextChange: (text: string) => void;
  onSaveMemo: () => void;
  onRequestDeleteTracker: (policyId: string) => void;
  onCancelDeleteTracker: () => void;
  onConfirmDeleteTracker: (policyId: string) => void;
}

export function TrackerDashboard({
  trackers,
  trackerTab,
  selectedTrackerPolicyId,
  activeTrackerItem,
  activeTrackerPolicy,
  showAddChecklistItem,
  newChecklistItemText,
  tempMemoText,
  showDeleteTrackerConfirm,
  onTrackerTabChange,
  onSelectTrackerPolicy,
  onStatusChange,
  onTargetDateChange,
  onOpenAddChecklistItem,
  onCancelAddChecklistItem,
  onNewChecklistItemTextChange,
  onAddChecklistItem,
  onToggleChecklistItem,
  onDeleteChecklistItem,
  onTempMemoTextChange,
  onSaveMemo,
  onRequestDeleteTracker,
  onCancelDeleteTracker,
  onConfirmDeleteTracker,
}: TrackerDashboardProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Split layout between List and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* TRACKER-01: LEFT COLUMN (Tracker list with Tabs) */}
        <div className="lg:col-span-5 space-y-5 text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-primary">
              YouthPick &gt; 나의 보관함
            </span>
            <h2 className="text-lg font-black text-slate-800">신청 준비 일정 관리</h2>
            <p className="text-xs text-slate-400">
              관심 등록한 정책의 제출 기한, 구비 서류 체크리스트를 놓치지 않게 체계적으로
              추적합니다.
            </p>
          </div>

          {/* Tracker Status filter buttons (TRACKER-01 layout) */}
          <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-2">
            {TRACKER_TABS.map((tab) => {
              const count =
                tab === "전체" ? trackers.length : trackers.filter((t) => t.status === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => onTrackerTabChange(tab)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-extrabold transition-all ${
                    trackerTab === tab
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200/85"
                  }`}
                >
                  {tab} {count}
                </button>
              );
            })}
          </div>

          {/* Listing Tracker Cards */}
          <div className="space-y-3">
            {trackers
              .filter((t) => trackerTab === "전체" || t.status === trackerTab)
              .map((track) => {
                const policyRef = track.policySnapshot;

                // Calculate completion percentage
                const totalItems = track.checklist.length;
                const completedItems = track.checklist.filter((c) => c.completed).length;
                const pct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

                const isSelected = selectedTrackerPolicyId === track.policyId;

                return (
                  <div
                    key={track.policyId}
                    onClick={() => onSelectTrackerPolicy(track.policyId)}
                    className={`rounded-2xl border p-4 transition-all cursor-pointer text-left ${
                      isSelected
                        ? "border-primary bg-primary/[0.01] shadow-sm ring-2 ring-primary/10"
                        : "border-slate-100 bg-white hover:border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                          track.status === "준비중"
                            ? "bg-amber-50 text-amber-600 border border-amber-100"
                            : track.status === "결과대기"
                              ? "bg-blue-50 text-blue-600 border border-blue-100"
                              : track.status === "신청완료"
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                : "bg-slate-50 text-slate-500 border border-slate-100"
                        }`}
                      >
                        {track.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">
                        목표: {track.targetDate}
                      </span>
                    </div>

                    <h4 className="text-xs font-extrabold text-slate-800 mt-2 line-clamp-1">
                      {policyRef.title}
                    </h4>

                    {/* Progress bar */}
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-[10px] font-extrabold text-slate-400">
                        <span>
                          체크리스트 {completedItems}/{totalItems} 완료
                        </span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                      <span>수정기록: 2026.06.23</span>
                      <span className="text-primary hover:underline flex items-center space-x-0.5">
                        <span>관리하기</span>
                        <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                );
              })}

            {trackers.filter((t) => trackerTab === "전체" || t.status === trackerTab).length ===
              0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-12 px-4 text-center text-slate-400 text-xs">
                이 카테고리 상태에 배정된 신청 일감이 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* TRACKER-02: RIGHT COLUMN (Selected Tracker detailed checks & memos) */}
        <div className="lg:col-span-7">
          {activeTrackerItem && activeTrackerPolicy ? (
            <div className="rounded-3xl border border-slate-100 bg-white p-6 text-left space-y-6 shadow-sm">
              {/* Header bar */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <span className="inline-block rounded px-1.5 py-0.5 text-[9px] font-bold bg-primary/10 text-primary">
                    {activeTrackerPolicy.category}
                  </span>
                  <h3 className="text-sm font-black text-slate-800 leading-tight pr-6">
                    {activeTrackerPolicy.title}
                  </h3>
                </div>
                <a
                  href={activeTrackerPolicy.link}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 rounded-xl border border-slate-200 px-3 py-1.5 text-[10px] font-extrabold text-slate-600 hover:bg-slate-50"
                >
                  공식 공고 ↗
                </a>
              </div>

              {/* Interactive inputs: Status, Target Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase">
                    신청 상태 변경
                  </label>
                  <select
                    value={activeTrackerItem.status}
                    onChange={(e) =>
                      onStatusChange(activeTrackerItem.policyId, e.target.value as TrackerStatus)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer focus:bg-white focus:border-primary"
                  >
                    <option value="관심">관심</option>
                    <option value="준비중">준비중</option>
                    <option value="신청완료">신청완료</option>
                    <option value="결과대기">결과대기</option>
                    <option value="종료">종료</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase">
                    목표 마감일 설정
                  </label>
                  <input
                    type="date"
                    value={activeTrackerItem.targetDate}
                    onChange={(e) => onTargetDateChange(activeTrackerItem.policyId, e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-primary"
                  />
                </div>
              </div>

              {/* Required documents brief (From wireframe Section 10) */}
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2">
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  정책 제출 서류 기본 안내
                </h4>
                <p className="text-xs text-slate-600 font-extrabold leading-relaxed">
                  • 신청서 및 자기소개서, 구직상태 자격 소명 확인서
                </p>
                <p className="text-[10px] text-slate-400">
                  * 주관 부처 마감 이전에 제출 서류 목록이 변동되었는지 공식 안내 고시를 반드시 교차
                  검토하세요.
                </p>
              </div>

              {/* Interactive checklist area with deletion option */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-800 flex items-center">
                    <CheckSquare className="h-4 w-4 text-primary mr-1.5" />
                    <span>준비 작업 체크리스트</span>
                  </h4>
                  <button
                    onClick={onOpenAddChecklistItem}
                    className="inline-flex items-center space-x-1 text-[10px] font-extrabold text-primary hover:underline cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>체크항목 추가</span>
                  </button>
                </div>

                {/* Checklist overlay modal */}
                {showAddChecklistItem && (
                  <div className="rounded-2xl border border-primary/20 bg-primary/[0.01] p-3 space-y-2.5">
                    <input
                      type="text"
                      placeholder="준비할 서류 또는 작업 내용을 적어보세요..."
                      value={newChecklistItemText}
                      onChange={(e) => onNewChecklistItemTextChange(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-primary"
                    />
                    <div className="flex justify-end space-x-1">
                      <button
                        onClick={onCancelAddChecklistItem}
                        className="rounded-lg border border-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-100"
                      >
                        취소
                      </button>
                      <button
                        onClick={onAddChecklistItem}
                        className="rounded-lg bg-primary px-2.5 py-1 text-[10px] font-bold text-white hover:brightness-105"
                      >
                        추가하기
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  {activeTrackerItem.checklist.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-slate-50 transition-colors"
                    >
                      <button
                        onClick={() => onToggleChecklistItem(activeTrackerItem.policyId, item.id)}
                        className="flex items-start space-x-2.5 text-left flex-1"
                      >
                        {item.completed ? (
                          <CheckSquare className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5 fill-primary/10" />
                        ) : (
                          <Square className="h-4.5 w-4.5 text-slate-300 shrink-0 mt-0.5" />
                        )}
                        <span
                          className={`text-xs font-semibold ${item.completed ? "line-through text-slate-400" : "text-slate-700"}`}
                        >
                          {item.text}
                        </span>
                      </button>
                      <button
                        onClick={() => onDeleteChecklistItem(activeTrackerItem.policyId, item.id)}
                        className="text-slate-300 hover:text-rose-500 rounded p-1 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Memo textarea (Character monitoring limit 2000 chars) */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-slate-800">
                  개인 업무 및 보완 기록 메모
                </label>
                <textarea
                  rows={4}
                  maxLength={2000}
                  placeholder="이곳에 이 정책 준비시 고려할 일정을 메모해 두세요. 예: 서류 제출시 담당 사무소 유선확인 필요 등"
                  value={tempMemoText}
                  onChange={(e) => onTempMemoTextChange(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 p-3 text-xs focus:outline-none focus:border-primary bg-slate-50/20"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{tempMemoText.length} / 2000 자</span>
                  <button
                    onClick={onSaveMemo}
                    className="rounded-lg bg-slate-800 px-3.5 py-1.5 text-[11px] font-bold text-white hover:bg-slate-700 transition-all cursor-pointer"
                  >
                    메모 저장하기
                  </button>
                </div>
              </div>

              {/* Dangerous tracker deletion option */}
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <button
                  onClick={() => onRequestDeleteTracker(activeTrackerItem.policyId)}
                  className="text-xs text-rose-500 font-bold hover:underline flex items-center space-x-1"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>이 정책의 신청관리 기록에서 삭제</span>
                </button>
              </div>

              {/* Tracker deletion check overlay */}
              {showDeleteTrackerConfirm === activeTrackerItem.policyId && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 space-y-3">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold text-rose-900">
                        정말로 신청 일정을 삭제하시겠습니까?
                      </h4>
                      <p className="text-[11px] text-rose-700 leading-normal">
                        기록을 지우면 그동안 기입해둔 맞춤 일정, 서류 체크리스트 및 개인 메모가
                        영구적으로 파기됩니다.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-1.5">
                    <button
                      onClick={onCancelDeleteTracker}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-600"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => onConfirmDeleteTracker(activeTrackerItem.policyId)}
                      className="rounded-lg bg-rose-600 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-rose-700"
                    >
                      삭제 확인
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-24 px-4 text-center space-y-3">
              <span className="text-4xl">📋</span>
              <h3 className="text-sm font-bold text-slate-700">관리할 신청 일감을 선택해 주세요</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                왼쪽의 신청관리 목록에서 특정 정책을 선택하거나, [맞춤 추천] 또는 [정책 찾기]
                목록에서 마음에 드는 항목의 **'신청관리 시작'**을 눌러보세요!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
