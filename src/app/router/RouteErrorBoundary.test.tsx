import { cleanup, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RouteErrorBoundary } from './RouteErrorBoundary';

function Boom({ message }: { message: string }): never {
  throw new Error(message);
}

function renderWithBoundary(message: string) {
  const router = createMemoryRouter([
    {
      errorElement: <RouteErrorBoundary />,
      children: [{ path: '/', element: <Boom message={message} /> }],
    },
  ]);
  return render(<RouterProvider router={router} />);
}

describe('RouteErrorBoundary', () => {
  beforeEach(() => {
    // errorElement 경로에서는 React/router가 원본 에러를 console.error로 남긴다 — 테스트 출력만 정리한다.
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup(); // vitest globals 미사용 환경이라 RTL auto-cleanup이 동작하지 않는다.
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('렌더 오류가 나면 흰 화면 대신 fallback UI를 보여준다', () => {
    renderWithBoundary('일반 렌더 오류');

    expect(screen.getByText('화면을 불러오지 못했습니다')).toBeTruthy();
    expect(screen.getByRole('button', { name: '다시 시도' })).toBeTruthy();
    expect(screen.getByRole('link', { name: '홈으로' })).toBeTruthy();
  });

  it('raw 에러 메시지를 사용자에게 노출하지 않는다', () => {
    renderWithBoundary('secret internal detail');

    expect(screen.queryByText(/secret internal detail/)).toBeNull();
  });

  it('청크 로드 오류라도 이미 자동 새로고침을 했다면 fallback UI로 안내한다', () => {
    sessionStorage.setItem('bop.chunk-reloaded', '1');

    renderWithBoundary('Failed to fetch dynamically imported module: /assets/MyPage-abc.js');

    // reload를 반복하지 않고 사용자에게 수동 복구 수단을 준다 (무한 새로고침 방지 가드).
    expect(screen.getByText('화면을 불러오지 못했습니다')).toBeTruthy();
  });
});
