import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const bookmarkApiMock = vi.hoisted(() => ({
  fetchApplications: vi.fn(),
  fetchBookmarkedPolicyIds: vi.fn(),
  toggleBookmark: vi.fn(),
}));

vi.mock('@/entities/user', () => ({
  useAuthStore: <T,>(selector: (state: { isAuthenticated: boolean }) => T) =>
    selector({ isAuthenticated: true }),
}));
vi.mock('@/shared/ui', () => ({ useToast: () => ({ showToast: vi.fn() }) }));
vi.mock('../api/bookmarkApi', () => bookmarkApiMock);

import { useBookmark } from './useBookmark';

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </MemoryRouter>
    );
  };
}

describe('useBookmark', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    bookmarkApiMock.fetchApplications.mockResolvedValue([]);
    bookmarkApiMock.fetchBookmarkedPolicyIds.mockResolvedValue([]);
  });

  it('관심 등록 요청이 진행 중이면 같은 정책을 다시 요청하지 않는다', async () => {
    let resolveToggle: (result: { saved: boolean }) => void;
    bookmarkApiMock.toggleBookmark.mockImplementation(
      () => new Promise<{ saved: boolean }>((resolve) => (resolveToggle = resolve)),
    );
    const { result } = renderHook(() => useBookmark(), { wrapper: createWrapper() });

    await waitFor(() => expect(bookmarkApiMock.fetchApplications).toHaveBeenCalledTimes(1));
    act(() => {
      result.current.toggleSave('42');
      result.current.toggleSave('42');
    });

    await waitFor(() => expect(bookmarkApiMock.toggleBookmark).toHaveBeenCalledTimes(1));
    act(() => resolveToggle({ saved: true }));
  });
});
