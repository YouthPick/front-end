import { beforeEach, describe, expect, it, vi } from 'vitest';

const apiClientMock = vi.hoisted(() => ({
  delete: vi.fn(),
  get: vi.fn(),
  patch: vi.fn(),
  post: vi.fn(),
}));

vi.mock('@/shared/api', () => ({ apiClient: apiClientMock }));

import {
  fetchTrackers,
  mapPolicyApplicationToTracker,
  type PolicyApplicationDto,
  toApiApplicationStatus,
} from './trackerApi';

const application: PolicyApplicationDto = {
  id: 91,
  policyId: 42,
  policyTitle: '청년 주거 지원',
  policyCategory: '주거',
  policyApplicationEndDate: '2026-08-31',
  status: 'PREPARING',
  memo: '등본 발급 필요',
  endAt: '2026-08-20T00:00:00',
  createdAt: '2026-07-20T10:00:00',
};

describe('정책 신청관리 API 매퍼', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('백엔드 신청관리와 체크리스트 DTO를 화면 모델로 변환한다', () => {
    expect(
      mapPolicyApplicationToTracker(application, [
        {
          id: 7,
          policyApplicationId: 91,
          message: '등본 제출',
          checked: true,
          createdAt: '2026-07-20T10:01:00',
        },
      ]),
    ).toEqual({
      applicationId: 91,
      policyId: '42',
      policyDeadline: '2026-08-31',
      status: '준비중',
      targetDate: '2026-08-20',
      checklist: [{ id: 7, text: '등본 제출', completed: true }],
      memo: '등본 발급 필요',
    });
  });

  it('화면 상태를 백엔드 ApplicationStatus enum으로 변환한다', () => {
    expect(toApiApplicationStatus('관심')).toBe('INTERESTED');
    expect(toApiApplicationStatus('준비중')).toBe('PREPARING');
    expect(toApiApplicationStatus('신청완료')).toBe('APPLIED');
    expect(toApiApplicationStatus('종료')).toBe('COMPLETED');
  });

  it('신청관리 목록과 각 신청의 체크리스트를 실제 API 경로로 조회한다', async () => {
    apiClientMock.get
      .mockResolvedValueOnce({ data: { data: [application], meta: {} } })
      .mockResolvedValueOnce({
        data: {
          data: [
            {
              id: 7,
              policyApplicationId: 91,
              message: '등본 제출',
              checked: false,
              createdAt: '2026-07-20T10:01:00',
            },
          ],
          meta: {},
        },
      });

    await expect(fetchTrackers()).resolves.toMatchObject([
      { applicationId: 91, policyId: '42', checklist: [{ id: 7, completed: false }] },
    ]);
    expect(apiClientMock.get).toHaveBeenNthCalledWith(1, '/v1/policy-applications', {
      params: { size: 100 },
    });
    expect(apiClientMock.get).toHaveBeenNthCalledWith(
      2,
      '/v1/policy-application-checklists/application/91',
      { params: { size: 100 } },
    );
  });
});
