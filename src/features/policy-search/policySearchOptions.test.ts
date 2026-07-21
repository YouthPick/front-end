import { describe, expect, it } from 'vitest';

import { EMPLOYMENT_STATUS_OPTIONS } from '@/entities/user';

import { STATUSES, toJobCodeParam } from './policySearchOptions';

// 라벨 → 온보딩 코드 → jobCd 두 단계를 거치므로, 어느 한쪽 라벨이 바뀌면 조용히 undefined가 되어
// 필터가 아무 일도 하지 않게 된다. 예전 mock 어휘가 정확히 그 상태였다.
describe('toJobCodeParam', () => {
  it('온보딩 취업상태 라벨을 온통청년 jobCd로 옮긴다', () => {
    expect(toJobCodeParam('재직')).toBe('0013001');
    expect(toJobCodeParam('미취업·구직')).toBe('0013003');
    expect(toJobCodeParam('창업·창업준비')).toBe('0013006');
  });

  it("'전체'와 미지정은 필터를 걸지 않는다", () => {
    expect(toJobCodeParam('전체')).toBeUndefined();
    expect(toJobCodeParam(undefined)).toBeUndefined();
    expect(toJobCodeParam('')).toBeUndefined();
  });

  it('목록에 없는 라벨은 필터를 걸지 않는다 (옛 URL·손수정 쿼리 방어)', () => {
    expect(toJobCodeParam('취업준비')).toBeUndefined();
    expect(toJobCodeParam('대학생')).toBeUndefined();
  });

  it('선택지로 노출하는 라벨은 전부 코드로 번역된다', () => {
    const selectable = STATUSES.filter((status) => status !== '전체');

    expect(selectable).toHaveLength(EMPLOYMENT_STATUS_OPTIONS.length);
    for (const label of selectable) {
      expect(toJobCodeParam(label)).toMatch(/^0013\d{3}$/);
    }
  });
});
