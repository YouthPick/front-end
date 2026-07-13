import type { LoginHistoryDto } from './loginHistory.dto';

const MOCK_USER_IDS = Array.from({ length: 12 }, (_, index) => `user-${index + 1}`);
const MOCK_HISTORY_COUNT = 64;
const DAY_MS = 24 * 60 * 60 * 1000;

function buildMockLoginHistories(): LoginHistoryDto[] {
  return Array.from({ length: MOCK_HISTORY_COUNT }, (_, index) => {
    const createdAt = new Date(Date.now() - index * (DAY_MS / 3)).toISOString();
    return {
      id: `login-history-${index + 1}`,
      userId: MOCK_USER_IDS[index % MOCK_USER_IDS.length],
      createdAt,
      // 로그인 이력은 갱신되지 않는 로그성 데이터라 mock에서는 생성 시각과 동일하게 둔다.
      updatedAt: createdAt,
    };
  });
}

export const MOCK_LOGIN_HISTORY_DTOS: LoginHistoryDto[] = buildMockLoginHistories();
