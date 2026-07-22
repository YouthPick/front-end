import { beforeEach, describe, expect, it, vi } from 'vitest';

import { queryClient } from '@/shared/api';

import { useAuthStore } from './authStore';

describe('authStore logout', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: {
        id: '1',
        name: '테스트 사용자',
        email: 'test@example.com',
        role: 'member',
      },
      isAuthenticated: true,
      isInitializing: false,
    });
    vi.restoreAllMocks();
  });

  it('clears cached server data with the local session', () => {
    const clearSpy = vi.spyOn(queryClient, 'clear');

    useAuthStore.getState().logout();

    expect(clearSpy).toHaveBeenCalledOnce();
    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      isAuthenticated: false,
    });
  });
});
