import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  PolicyChatDisabledState,
  PolicyChatPresenter,
} from '@/features/policy-chat/components/PolicyChatContainer/PolicyChatPresenter';
import { mergePolicyChatMessages } from '@/features/policy-chat/model/policyChatMapper';

describe('policy chat smoke', () => {
  it('renders the disabled state copy', () => {
    render(<PolicyChatDisabledState />);

    expect(screen.getByText('이 정책은 지금 채팅을 이용할 수 없습니다')).toBeTruthy();
  });

  it('merges chat messages by id and keeps the latest payload', () => {
    expect(
      mergePolicyChatMessages(
        [
          {
            id: 1,
            policyId: 10,
            authorName: 'A',
            content: 'one',
            createdAt: '2026-01-01T00:00:00.000Z',
            mine: false,
          },
          {
            id: 3,
            policyId: 10,
            authorName: 'B',
            content: 'three',
            createdAt: '2026-01-01T00:02:00.000Z',
            mine: false,
          },
        ],
        [
          {
            id: 2,
            policyId: 10,
            authorName: 'C',
            content: 'two',
            createdAt: '2026-01-01T00:01:00.000Z',
            mine: true,
          },
          {
            id: 3,
            policyId: 10,
            authorName: 'B',
            content: 'three-updated',
            createdAt: '2026-01-01T00:03:00.000Z',
            mine: true,
          },
        ],
      ),
    ).toEqual([
      {
        id: 1,
        policyId: 10,
        authorName: 'A',
        content: 'one',
        createdAt: '2026-01-01T00:00:00.000Z',
        mine: false,
      },
      {
        id: 2,
        policyId: 10,
        authorName: 'C',
        content: 'two',
        createdAt: '2026-01-01T00:01:00.000Z',
        mine: true,
      },
      {
        id: 3,
        policyId: 10,
        authorName: 'B',
        content: 'three-updated',
        createdAt: '2026-01-01T00:03:00.000Z',
        mine: true,
      },
    ]);
  });

  it('keeps the draft when sending reports failure', async () => {
    render(
      <PolicyChatPresenter
        messages={[]}
        status="ready"
        errorMessage={null}
        isSending={false}
        sendErrorMessage={null}
        onRetry={() => undefined}
        onSendMessage={() => Promise.resolve(false)}
      />,
    );

    const input = screen.getByLabelText('정책 대화 메시지 입력');
    fireEvent.change(input, { target: { value: 'draft survives' } });
    fireEvent.click(screen.getByLabelText('정책 대화 메시지 보내기'));

    expect(await screen.findByDisplayValue('draft survives')).toBeTruthy();
  });
});
