import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { AxiosError, AxiosHeaders } from 'axios';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const communityPostApiMock = vi.hoisted(() => ({
  fetchCommunityPost: vi.fn(),
  fetchCommunityPosts: vi.fn(),
  searchCommunityPosts: vi.fn(),
}));

vi.mock('../api/communityPostApi', () => communityPostApiMock);

import { useCommunityPostQuery } from './communityPostQueries';

// 백엔드 에러 응답을 흉내 낸 AxiosError. 훅의 404 분기(isNotFound)가 status를 보고 갈리는지 검증한다.
function createHttpError(status: number): AxiosError {
  const error = new AxiosError(`Request failed with status code ${status}`);
  error.response = {
    status,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: { status, code: 'C001', message: 'error', errors: [], timestamp: '' },
  };
  return error;
}

function createWrapper() {
  const queryClient = new QueryClient({
    // 전역 설정(retry: 1)과 같은 재시도 횟수를 쓰되, 테스트가 느려지지 않게 지연만 제거한다.
    // retry 자체는 훅이 직접 지정하므로 여기서 끄지 않는다 — 404 재시도 제외를 그대로 검증한다.
    defaultOptions: { queries: { retry: 1, retryDelay: 0 } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useCommunityPostQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('404 응답이면 isNotFound가 true이고 재시도하지 않는다', async () => {
    communityPostApiMock.fetchCommunityPost.mockRejectedValue(createHttpError(404));

    const { result } = renderHook(() => useCommunityPostQuery('999'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.isNotFound).toBe(true);
    // 삭제된 게시글은 재시도해도 영원히 실패하므로 retry 대상에서 제외되어야 한다.
    expect(communityPostApiMock.fetchCommunityPost).toHaveBeenCalledTimes(1);
  });

  it('404가 아닌 오류는 isNotFound가 false이고 기존대로 1회 재시도한다', async () => {
    communityPostApiMock.fetchCommunityPost.mockRejectedValue(createHttpError(500));

    const { result } = renderHook(() => useCommunityPostQuery('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.isNotFound).toBe(false);
    // 최초 1회 + 재시도 1회 = 2회.
    expect(communityPostApiMock.fetchCommunityPost).toHaveBeenCalledTimes(2);
  });

  it('네트워크 단절(response 없음) 오류는 isNotFound가 아니다', async () => {
    communityPostApiMock.fetchCommunityPost.mockRejectedValue(new AxiosError('Network Error'));

    const { result } = renderHook(() => useCommunityPostQuery('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.isNotFound).toBe(false);
  });
});
