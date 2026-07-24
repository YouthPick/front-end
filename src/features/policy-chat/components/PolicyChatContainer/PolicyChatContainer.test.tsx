import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuthStore } from '@/entities/user';
import { PolicyChatContainer } from './PolicyChatContainer';

const usePolicyChatMock = vi.hoisted(() => vi.fn());

vi.mock('../../hooks/usePolicyChat', () => ({
  usePolicyChat: usePolicyChatMock,
}));

describe('PolicyChatContainer', () => {
  beforeEach(() => {
    usePolicyChatMock.mockReset();
    usePolicyChatMock.mockReturnValue({
      messages: [],
      status: 'ready',
      errorMessage: null,
      isSending: false,
      sendErrorMessage: null,
      retry: vi.fn(),
      sendMessage: vi.fn(),
    });
    useAuthStore.setState({ isAuthenticated: true });
  });

  it('disables chat for a malformed (non-numeric) policy id instead of connecting to STOMP', () => {
    render(<PolicyChatContainer policyId="not-a-real-id" />);

    expect(screen.getByText('이 정책은 지금 채팅을 이용할 수 없습니다')).toBeTruthy();
    expect(usePolicyChatMock).toHaveBeenCalledWith(
      expect.objectContaining({ policyId: null, enabled: false }),
    );
  });

  it('enables chat for a real backend policy id', () => {
    render(<PolicyChatContainer policyId="1" />);

    expect(usePolicyChatMock).toHaveBeenCalledWith(
      expect.objectContaining({ policyId: 1, enabled: true }),
    );
  });
});
