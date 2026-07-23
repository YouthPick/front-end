import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { UserProfile } from '@/entities/user';

import { HomeRecommendSection } from './HomeRecommendSection';

const profile: UserProfile = {
  birthYear: 2000,
  region: '서울특별시',
  subRegion: '강남구',
  employmentStatus: '재직자',
  educationStatus: '대학 졸업',
  maritalStatus: '미혼',
  major: '제한없음',
  specialConditions: [],
  annualIncome: null,
  incomeUnknown: true,
  interests: ['일자리'],
  keywords: [],
  isOnboarded: true,
};

const baseProps = {
  isAuthenticated: true,
  userName: '홍길동',
  profile,
  recommendations: [],
  isFallback: false,
  isLoading: false,
  isError: false,
  onRetry: vi.fn(),
  onStartRecommend: vi.fn(),
  onEditProfile: vi.fn(),
  onBrowseAll: vi.fn(),
  onViewAll: vi.fn(),
  onViewDetails: vi.fn(),
};

describe('HomeRecommendSection', () => {
  // vitest globals를 쓰지 않아 RTL 자동 cleanup이 등록되지 않는다. 렌더 결과가 document에 누적되지
  // 않도록 직접 정리한다.
  afterEach(cleanup);

  it('온보딩 미완료 사용자(profile: null)에게 스켈레톤 대신 프로필 설정 CTA를 보여준다', () => {
    render(<HomeRecommendSection {...baseProps} profile={null} />);

    expect(screen.getByRole('button', { name: '맞춤 프로필 설정하고 추천받기' })).toBeTruthy();
    expect(screen.queryByText(/추천 정책/)).toBeNull();
  });

  it('온보딩 완료 사용자에게는 추천 미리보기를 보여준다', () => {
    render(<HomeRecommendSection {...baseProps} />);

    expect(screen.getByText('홍길동님과 일치 확률이 가장 높은 추천 정책')).toBeTruthy();
    expect(screen.queryByRole('button', { name: '맞춤 프로필 설정하고 추천받기' })).toBeNull();
  });

  it('비로그인 사용자에게는 로그인 진입 CTA를 보여준다', () => {
    render(<HomeRecommendSection {...baseProps} isAuthenticated={false} userName={null} />);

    expect(screen.getByRole('button', { name: '내 조건에 맞는 정책 추천받기' })).toBeTruthy();
  });

  it('추천 로딩 중에만 스켈레톤을 보여준다', () => {
    const { container } = render(
      <HomeRecommendSection {...baseProps} profile={null} isLoading={true} />,
    );

    expect(container.querySelector('.animate-pulse')).toBeTruthy();
    expect(screen.queryByRole('button', { name: '맞춤 프로필 설정하고 추천받기' })).toBeNull();
  });

  it('추천 조회 실패 시 재시도 가능한 에러 상태를 보여준다', () => {
    render(<HomeRecommendSection {...baseProps} isError={true} />);

    expect(screen.getByText('맞춤 추천을 불러오지 못했습니다')).toBeTruthy();
  });
});
