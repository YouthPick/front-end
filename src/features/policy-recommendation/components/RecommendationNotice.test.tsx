import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { RecommendationNotice } from './RecommendationNotice';

describe('RecommendationNotice', () => {
  // vitest globals를 쓰지 않아 RTL 자동 cleanup이 등록되지 않는다.
  afterEach(cleanup);

  it('자격 매칭 상태에서는 자격 조건 기준으로 골랐다고 안내한다', () => {
    render(<RecommendationNotice isFallback={false} />);

    expect(screen.getByText(/자격 조건.*충족하는 정책만/)).toBeTruthy();
    // 백엔드 자격 필터 적용 전의 한계 고지가 되살아나지 않도록 고정한다.
    expect(screen.queryByText(/부적격/)).toBeNull();
    expect(screen.queryByText(/연동 전/)).toBeNull();
  });

  it('fallback 상태에서는 매칭 결과가 아님을 알리고 상태 영역으로 노출한다', () => {
    render(<RecommendationNotice isFallback />);

    const notice = screen.getByRole('status');
    expect(notice.textContent).toContain('자격 조건 매칭 결과가 아닙니다');
    expect(screen.queryByText(/충족하는 정책만/)).toBeNull();
  });
});
