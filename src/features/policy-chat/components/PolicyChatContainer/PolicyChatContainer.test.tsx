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

  it('disables chat for a mock/demo policy id instead of connecting to STOMP', () => {
    render(<PolicyChatContainer policyId="1" />);

    expect(screen.getByText('실제 정책 정보에서 채팅을 이용할 수 있습니다')).toBeTruthy();
    expect(usePolicyChatMock).toHaveBeenCalledWith(
      expect.objectContaining({ policyId: null, enabled: false }),
    );
  });

  it('enables chat for a numeric policy id outside the mock dataset', () => {
    render(<PolicyChatContainer policyId="100001" />);

    expect(usePolicyChatMock).toHaveBeenCalledWith(
      expect.objectContaining({ policyId: 100001, enabled: true }),
    );
  });
});
