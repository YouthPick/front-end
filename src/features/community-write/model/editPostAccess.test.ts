import { describe, expect, it } from 'vitest';

import type { CommunityPost } from '@/entities/community-post';

import { resolveEditPostAccess } from './editPostAccess';

const post: CommunityPost = {
  id: '10',
  title: '테스트 게시글',
  category: '잡담',
  content: '<p>본문</p>',
  authorId: '1',
  authorName: '작성자',
  createdAt: '2026-07-01',
  viewCount: 0,
  commentCount: 0,
  likeCount: 0,
  attachedPolicy: null,
  policyId: null,
};

// axios.isAxiosError는 isAxiosError 플래그만 확인하므로 최소 형태로 흉내 낸다.
function createAxiosError(status: number): unknown {
  return { isAxiosError: true, response: { status } };
}

const base = {
  isEditMode: true,
  isLoading: false,
  isError: false,
  error: null,
  post,
  currentUserId: '1',
};

describe('resolveEditPostAccess', () => {
  it('새 글 작성 모드면 조회 상태와 무관하게 create를 반환한다', () => {
    expect(
      resolveEditPostAccess({ ...base, isEditMode: false, post: undefined, currentUserId: '2' }),
    ).toBe('create');
  });

  it('수정 모드에서 게시글 조회 중이면 loading을 반환한다', () => {
    expect(resolveEditPostAccess({ ...base, isLoading: true, post: undefined })).toBe('loading');
  });

  it('조회가 404 외 오류로 실패하면 error를 반환한다', () => {
    expect(
      resolveEditPostAccess({
        ...base,
        isError: true,
        error: createAxiosError(500),
        post: undefined,
      }),
    ).toBe('error');
  });

  it('404로 실패하면 not-found를 반환한다', () => {
    expect(
      resolveEditPostAccess({
        ...base,
        isError: true,
        error: createAxiosError(404),
        post: undefined,
      }),
    ).toBe('not-found');
  });

  it('조회 결과가 null(식별 불가/삭제된 게시글)이면 not-found를 반환한다', () => {
    expect(resolveEditPostAccess({ ...base, post: null })).toBe('not-found');
  });

  it('현재 사용자가 작성자가 아니면 forbidden을 반환한다', () => {
    expect(resolveEditPostAccess({ ...base, currentUserId: '2' })).toBe('forbidden');
  });

  it('현재 사용자를 알 수 없으면 forbidden을 반환한다', () => {
    expect(resolveEditPostAccess({ ...base, currentUserId: undefined })).toBe('forbidden');
  });

  it('현재 사용자가 작성자면 allowed를 반환한다', () => {
    expect(resolveEditPostAccess(base)).toBe('allowed');
  });
});
