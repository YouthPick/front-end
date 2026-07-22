import { describe, expect, it } from 'vitest';

import { getOAuthCallbackErrorMessage } from './oauthCallbackError';

describe('getOAuthCallbackErrorMessage', () => {
  it('identifies a user-cancelled consent flow', () => {
    expect(getOAuthCallbackErrorMessage('access_denied')).toBe(
      '로그인을 취소하셨습니다. 원하실 때 다시 시도해 주세요.',
    );
  });

  it('does not expose provider error details', () => {
    expect(getOAuthCallbackErrorMessage('server_error')).toBe(
      '소셜 로그인 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    );
  });

  it('returns null when the callback has no provider error', () => {
    expect(getOAuthCallbackErrorMessage(null)).toBeNull();
  });
});
