import { useEffect, useState } from 'react';
import { Link, useRouteError } from 'react-router';

import { ROUTES } from '@/shared/constants';

const CHUNK_RELOAD_FLAG = 'bop.chunk-reloaded';

// 재배포로 청크 해시가 바뀐 뒤 lazy 라우트의 dynamic import가 실패할 때 나는 오류.
// 브라우저마다 메시지가 달라 대표 패턴을 함께 매칭한다.
function isChunkLoadError(error: unknown): boolean {
  return (
    error instanceof Error &&
    /dynamically imported module|module script failed|Loading chunk/i.test(error.message)
  );
}

// 시크릿 모드 등 sessionStorage 접근이 막힌 환경에서도 boundary 자체는 동작해야 한다.
function hasReloadedThisSession(): boolean {
  try {
    return sessionStorage.getItem(CHUNK_RELOAD_FLAG) === '1';
  } catch {
    return true; // 저장 불가면 자동 새로고침을 건너뛰고 fallback UI로 안내한다.
  }
}

function markReloadedThisSession(): void {
  try {
    sessionStorage.setItem(CHUNK_RELOAD_FLAG, '1');
  } catch {
    // 무시 — hasReloadedThisSession이 true를 돌려주므로 무한 새로고침은 없다.
  }
}

/**
 * 라우터 최상위 errorElement. 렌더 예외·청크 로드 실패가 흰 화면으로 끝나지 않게 막는 마지막 방어선이다.
 * 청크 로드 실패는 새 배포 산출물을 받으면 해결되므로 세션당 1회 자동 새로고침으로 자가 복구를 시도한다.
 */
export function RouteErrorBoundary() {
  const error = useRouteError();
  const [isAutoReloading] = useState(() => isChunkLoadError(error) && !hasReloadedThisSession());

  useEffect(() => {
    // 사용자에게는 raw 에러를 노출하지 않고(§9.2) 디버깅용으로 콘솔에만 남긴다.
    console.error('Route error boundary caught:', error);
  }, [error]);

  useEffect(() => {
    if (!isAutoReloading) return;
    markReloadedThisSession();
    window.location.reload();
  }, [isAutoReloading]);

  if (isAutoReloading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <p role="status" className="text-sm font-bold text-slate-500">
          새 버전을 불러오는 중입니다…
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <section
        role="alert"
        aria-label="화면 오류"
        className="w-full max-w-md space-y-4 rounded-3xl border border-rose-100 bg-rose-50/30 px-6 py-16 text-center"
      >
        <h1 className="text-base font-extrabold text-rose-700">화면을 불러오지 못했습니다</h1>
        <p className="text-sm text-slate-500">
          일시적인 문제일 수 있어요. 다시 시도하거나 홈으로 이동해 주세요.
        </p>
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
          >
            다시 시도
          </button>
          <Link
            to={ROUTES.home}
            reloadDocument
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            홈으로
          </Link>
        </div>
      </section>
    </main>
  );
}
