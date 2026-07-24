import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const communityLikeApiMock = vi.hoisted(() => ({
  fetchLikedCommunityPostIds: vi.fn(),
  toggleCommunityLike: vi.fn(),
}));
const authStateMock = vi.hoisted(() => ({ isAuthenticated: true }));
const showToastMock = vi.hoisted(() => vi.fn());

vi.mock('@/entities/user', () => ({
  useAuthStore: <T,>(selector: (state: { isAuthenticated: boolean }) => T) =>
    selector(authStateMock),
}));
// 게시글 entity 배럴은 실서버 apiClient까지 끌고 오므로 훅이 쓰는 쿼리 키만 대체한다.
vi.mock('@/entities/community-post', () => ({
  communityPostKeys: { all: ['community-posts'] as const },
}));
vi.mock('@/shared/ui', () => ({ useToast: () => ({ showToast: showToastMock }) }));
vi.mock('../api/communityLikeApi', () => communityLikeApiMock);

import { useCommunityLike } from './useCommunityLike';

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

describe('useCommunityLike', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authStateMock.isAuthenticated = true;
    communityLikeApiMock.fetchLikedCommunityPostIds.mockResolvedValue([]);
  });

  it('비로그인 상태에서 좋아요를 토글하면 요청을 보내지 않고 로그인 안내 토스트를 띄운다', async () => {
    authStateMock.isAuthenticated = false;
    const { result } = renderHook(() => useCommunityLike(), { wrapper: createWrapper() });

    await waitFor(() =>
      expect(communityLikeApiMock.fetchLikedCommunityPostIds).toHaveBeenCalledTimes(1),
    );
    act(() => {
      result.current.toggleLike('42');
    });

    expect(communityLikeApiMock.toggleCommunityLike).not.toHaveBeenCalled();
    expect(showToastMock).toHaveBeenCalledWith(
      '로그인이 필요한 기능입니다. 로그인 화면으로 안내합니다.',
      'info',
    );
  });

  it('좋아요 요청이 진행 중이면 같은 게시글을 다시 토글해도 요청을 반복하지 않는다', async () => {
    let resolveToggle: (result: { liked: boolean }) => void;
    communityLikeApiMock.toggleCommunityLike.mockImplementation(
      () => new Promise<{ liked: boolean }>((resolve) => (resolveToggle = resolve)),
    );
    const { result } = renderHook(() => useCommunityLike(), { wrapper: createWrapper() });

    await waitFor(() =>
      expect(communityLikeApiMock.fetchLikedCommunityPostIds).toHaveBeenCalledTimes(1),
    );
    act(() => {
      result.current.toggleLike('42');
      result.current.toggleLike('42');
    });

    await waitFor(() => expect(communityLikeApiMock.toggleCommunityLike).toHaveBeenCalledTimes(1));
    act(() => resolveToggle({ liked: true }));
  });
});
