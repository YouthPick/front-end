import { Skeleton } from '@/shared/ui';

import { useSyncSummary } from '../hooks/useSyncSummary';
import type { SyncSummary } from '../types/adminSync.types';

const CARD_METAS = [
  {
    key: 'activeCount',
    label: '전국 활성 청년정책',
    valueClass: 'text-slate-800',
  },
  {
    key: 'missingCount',
    label: '원본 URL 파손 누락',
    valueClass: 'text-amber-600',
  },
  {
    key: 'parseErrorCount',
    label: '신청기간 날짜 파싱오류',
    valueClass: 'text-rose-500',
  },
  {
    key: 'dbFailCount',
    label: '공공 DB 접속 실패 수',
    valueClass: 'text-slate-500',
  },
] satisfies {
  key: keyof SyncSummary;
  label: string;
  valueClass: string;
}[];

function getCardNote(key: keyof SyncSummary, value: number): { note: string; noteClass: string } {
  if (key === 'activeCount') {
    return {
      note: '✓ API 정상 수신 완료',
      noteClass: 'text-emerald-500',
    };
  }
  if (key === 'missingCount') {
    return value === 0
      ? { note: '✓ 누락된 원본 URL 없음', noteClass: 'text-emerald-500' }
      : { note: '일부 URL 파손 (백업 데이터 노출)', noteClass: 'text-amber-500' };
  }
  if (key === 'parseErrorCount') {
    return value === 0
      ? { note: '✓ 날짜 포맷 파싱 오류 없음', noteClass: 'text-emerald-500' }
      : { note: '⚠️ 수동 입력 보정 대기', noteClass: 'text-rose-400' };
  }
  if (key === 'dbFailCount') {
    return value === 0
      ? { note: '✓ 모든 공공 DB 연결 양호', noteClass: 'text-emerald-500' }
      : { note: '⚠️ 전회차 크롤러 캐시 가동', noteClass: 'text-rose-400' };
  }
  return { note: '', noteClass: 'text-slate-400' };
}

export function SyncSummaryCards() {
  const { data: summary, isLoading, isError } = useSyncSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CARD_METAS.map((card) => (
          <Skeleton key={card.key} className="h-24" />
        ))}
      </div>
    );
  }

  if (isError || !summary) {
    return (
      <p className="rounded-2xl border border-rose-100 bg-rose-50/30 p-4 text-left text-xs font-bold text-rose-600">
        동기화 지표를 불러오지 못했습니다.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARD_METAS.map((card) => {
        const value = summary[card.key];
        const { note, noteClass } = getCardNote(card.key, value);
        return (
          <div
            key={card.key}
            className="rounded-2xl border border-slate-100 bg-white p-4.5 text-left shadow-sm"
          >
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {card.label}
            </span>
            <span className={`text-xl font-black block mt-1 ${card.valueClass}`}>
              {value.toLocaleString('ko-KR')}건
            </span>
            <span className={`text-[9px] font-bold mt-1 block ${noteClass}`}>{note}</span>
          </div>
        );
      })}
    </div>
  );
}
