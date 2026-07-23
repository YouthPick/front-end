import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Policy } from '@/entities/policy';
import type { PolicyRecommendation } from '@/features/policy-recommendation';

import { RecommendationFeed } from './RecommendationFeed';

const useRecommendationsMock = vi.hoisted(() => vi.fn());

vi.mock('@/features/policy-recommendation', () => ({
  useRecommendations: useRecommendationsMock,
  // 카드 내부 렌더는 이 테스트의 관심사가 아니라 "몇 건이 어떤 순서로 노출되는가"만 확인한다.
  RecommendationCard: ({ recommendation }: { recommendation: PolicyRecommendation }) => (
    <article data-testid="recommendation-card">{recommendation.policy.title}</article>
  ),
}));

vi.mock('@/features/policy-bookmark', () => ({
  useBookmark: () => ({ isSaved: () => false, toggleSave: vi.fn() }),
}));

vi.mock('@/features/policy-compare', () => ({
  useCompare: () => ({ isComparing: () => false, toggleCompare: vi.fn() }),
}));

vi.mock('react-router', () => ({
  useNavigate: () => vi.fn(),
}));

function makeRecommendation(index: number): PolicyRecommendation {
  const policy: Policy = {
    id: `policy-${index}`,
    title: `정책 ${index}`,
    category: '일자리',
    region: '서울특별시',
    tag: '추천',
    organizationName: '고용노동부',
    description: '설명',
    target: '청년',
    eligibleStatuses: [],
    ageMin: null,
    ageMax: null,
    maritalCondition: '제한없음',
    majorCondition: '제한없음',
    specialConditionTags: [],
    incomeMax: null,
    deadline: '2026-12-31',
    supportContent: null,
    additionalQualification: null,
    applicationMethod: null,
    submissionDocuments: null,
    screeningMethod: null,
    participationRestriction: null,
    details: [],
    link: 'https://example.com',
    isSourceMissing: false,
  };

  return { policy, score: 100 - index, reliability: 'HIGH', reasons: [] };
}

function makeRecommendations(count: number): PolicyRecommendation[] {
  return Array.from({ length: count }, (_, index) => makeRecommendation(index + 1));
}

interface FeedState {
  recommendations: PolicyRecommendation[];
  isLoading: boolean;
  isError: boolean;
  reload: () => void;
}

function mockFeedState(overrides: Partial<FeedState> = {}) {
  useRecommendationsMock.mockReturnValue({
    recommendations: [],
    isLoading: false,
    isError: false,
    reload: vi.fn(),
    ...overrides,
  });
}

describe('RecommendationFeed', () => {
  beforeEach(() => {
    useRecommendationsMock.mockReset();
  });

  // vitest globals를 쓰지 않아 RTL 자동 cleanup이 등록되지 않는다.
  afterEach(cleanup);

  it('매칭된 전체 건수를 표시하고 목록은 페이지 단위로 나눠 노출한다', () => {
    mockFeedState({ recommendations: makeRecommendations(19) });

    render(<RecommendationFeed />);

    expect(screen.getByText('총 19건')).toBeTruthy();
    expect(screen.getByText('1 / 3 페이지')).toBeTruthy();
    expect(screen.getAllByTestId('recommendation-card')).toHaveLength(8);
    expect(screen.getByText('정책 1')).toBeTruthy();
    expect(screen.queryByText('정책 9')).toBeNull();
  });

  it('마지막 페이지로 이동하면 남은 추천을 볼 수 있다', () => {
    mockFeedState({ recommendations: makeRecommendations(19) });

    render(<RecommendationFeed />);
    fireEvent.click(screen.getByRole('button', { name: '3 페이지' }));

    expect(screen.getByText('3 / 3 페이지')).toBeTruthy();
    expect(screen.getAllByTestId('recommendation-card')).toHaveLength(3);
    expect(screen.getByText('정책 19')).toBeTruthy();
    expect(screen.queryByText('정책 1')).toBeNull();
  });

  // 추천 엔진 장애 시 recommendApi가 최신 정책 6건으로 fallback한다(규칙 10 Degraded).
  it('한 페이지에 담기는 fallback 목록에서는 페이지네이션을 숨기고 전부 노출한다', () => {
    mockFeedState({ recommendations: makeRecommendations(6) });

    render(<RecommendationFeed />);

    expect(screen.getAllByTestId('recommendation-card')).toHaveLength(6);
    expect(screen.getByText('총 6건')).toBeTruthy();
    expect(screen.queryByRole('navigation', { name: '페이지네이션' })).toBeNull();
  });

  it('로딩 / 에러 / 빈 상태에서는 목록 대신 각 상태 UI를 보여준다', () => {
    mockFeedState({ isLoading: true });
    const { container } = render(<RecommendationFeed />);
    expect(container.querySelector('.animate-pulse')).toBeTruthy();
    expect(screen.queryByTestId('recommendation-card')).toBeNull();
    cleanup();

    mockFeedState({ isError: true });
    render(<RecommendationFeed />);
    expect(screen.getByRole('button', { name: '다시 시도' })).toBeTruthy();
    cleanup();

    mockFeedState();
    render(<RecommendationFeed />);
    expect(screen.getByText('아직 추천할 정책이 없습니다')).toBeTruthy();
  });
});
