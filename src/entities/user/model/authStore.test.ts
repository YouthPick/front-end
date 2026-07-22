import { beforeEach, describe, expect, it } from 'vitest';

import { notifySessionExpired, queryClient, setAccessToken } from '@/shared/api';

import { useAuthStore } from './authStore';
import type { AuthUser } from './user.types';

const TEST_USER: AuthUser = {
  id: 'user-1',
  name: '테스트',
  email: 'test@example.com',
  role: 'member',
};

function seedPersonalCache() {
  queryClient.setQueryData(['me', 'profile'], { nickname: '이전 사용자' });
  queryClient.setQueryData(['bookmarks'], ['42']);
}

describe('authStore 로그아웃 시 서버 상태 캐시 정리', () => {
  beforeEach(() => {
    queryClient.clear();
    useAuthStore.setState({ user: null, isAuthenticated: false, isInitializing: false });
  });

  it('logout()은 TanStack Query 캐시를 전부 비운다', () => {
    useAuthStore.getState().login(TEST_USER);
    seedPersonalCache();
    expect(queryClient.getQueryCache().getAll()).not.toHaveLength(0);

    useAuthStore.getState().logout();

    expect(queryClient.getQueryData(['me', 'profile'])).toBeUndefined();
    expect(queryClient.getQueryData(['bookmarks'])).toBeUndefined();
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('세션 만료(notifySessionExpired) 시에도 캐시를 전부 비운다', () => {
    setAccessToken('expired-access-token');
    useAuthStore.getState().login(TEST_USER);
    seedPersonalCache();

    notifySessionExpired();

    expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
