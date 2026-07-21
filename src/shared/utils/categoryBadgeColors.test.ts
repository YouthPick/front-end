import { describe, expect, it } from 'vitest';

import { getPolicyCategoryBadgeClasses } from './categoryBadgeColors';

// PolicyCategory와 같은 목록. shared는 entities를 import할 수 없어 값을 복제한다.
const DISPLAYED_CATEGORIES = [
  '일자리',
  '주거',
  '교육·직업훈련',
  '금융·복지·문화',
  '참여·기반',
  '기타',
];

describe('getPolicyCategoryBadgeClasses', () => {
  it('표시되는 카테고리는 서로 다른 색을 쓴다', () => {
    const classes = DISPLAYED_CATEGORIES.map(getPolicyCategoryBadgeClasses);

    expect(new Set(classes).size).toBe(DISPLAYED_CATEGORIES.length);
  });

  it('실분류인 참여·기반과 미분류인 기타가 같은 색이 아니다', () => {
    expect(getPolicyCategoryBadgeClasses('참여·기반')).not.toBe(
      getPolicyCategoryBadgeClasses('기타'),
    );
  });

  it('알 수 없는 값은 기타와 같은 중립색으로 처리한다', () => {
    expect(getPolicyCategoryBadgeClasses('알 수 없는 분류')).toBe(
      getPolicyCategoryBadgeClasses('기타'),
    );
  });

  it('정규화 전 백엔드 원본 표기도 정규화된 표기와 같은 색을 쓴다', () => {
    expect(getPolicyCategoryBadgeClasses('교육')).toBe(
      getPolicyCategoryBadgeClasses('교육·직업훈련'),
    );
    expect(getPolicyCategoryBadgeClasses('복지·문화')).toBe(
      getPolicyCategoryBadgeClasses('금융·복지·문화'),
    );
    expect(getPolicyCategoryBadgeClasses('참여권리')).toBe(
      getPolicyCategoryBadgeClasses('참여·기반'),
    );
  });
});
