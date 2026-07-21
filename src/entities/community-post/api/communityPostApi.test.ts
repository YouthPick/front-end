import { beforeEach, describe, expect, it, vi } from 'vitest';

const apiClientMock = vi.hoisted(() => ({
  delete: vi.fn(),
  get: vi.fn(),
  patch: vi.fn(),
  post: vi.fn(),
}));

vi.mock('@/shared/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/api')>();
  return { ...actual, apiClient: apiClientMock };
});

import {
  createCommunityPost,
  deleteCommunityPost,
  fetchCommunityPost,
  fetchCommunityPosts,
  updateCommunityPost,
} from './communityPostApi';

describe('커뮤니티 게시글 생성 API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('본문의 서버 이미지 URL을 첨부 URL 목록으로 게시글 생성 API에 전달한다', async () => {
    apiClientMock.post.mockResolvedValue({
      data: {
        data: {
          id: 91,
          authorId: 3,
          authorNickname: '정원',
          policyId: null,
          policyTitle: null,
          category: 'FREE',
          title: '이미지 글',
          content: '<img src="/api/v1/files/2e5c2c2f-22c7-43a9-8d2c-8902a29b2b21">',
          viewCount: 0,
          createdAt: '2026-07-20T10:00:00',
          updatedAt: '2026-07-20T10:00:00',
        },
      },
    });

    await createCommunityPost({
      title: '이미지 글',
      category: '잡담',
      content: '<img src="/api/v1/files/2e5c2c2f-22c7-43a9-8d2c-8902a29b2b21">',
      authorId: '3',
      authorName: '정원',
    });

    expect(apiClientMock.post).toHaveBeenCalledWith('/v1/posts', {
      category: 'FREE',
      title: '이미지 글',
      content: '<img src="/api/v1/files/2e5c2c2f-22c7-43a9-8d2c-8902a29b2b21">',
      policyId: null,
      attachmentUrls: ['/api/v1/files/2e5c2c2f-22c7-43a9-8d2c-8902a29b2b21'],
    });
  });

  it('생성 후 상세 페이지는 실제 게시글 API에서 조회한다', async () => {
    apiClientMock.get.mockResolvedValue({
      data: {
        data: {
          id: 91,
          authorId: 3,
          authorNickname: '정원',
          policyId: null,
          policyTitle: null,
          category: 'FREE',
          title: '이미지 글',
          content: '내용',
          viewCount: 0,
          createdAt: '2026-07-20T10:00:00',
        },
      },
    });

    await expect(fetchCommunityPost('91')).resolves.toMatchObject({
      id: '91',
      category: '잡담',
      authorName: '정원',
    });
    expect(apiClientMock.get).toHaveBeenCalledWith('/v1/posts/91');
  });

  it('게시글 수정 시 이미지 첨부 URL까지 실제 PATCH API에 전달한다', async () => {
    apiClientMock.patch.mockResolvedValue({
      data: {
        data: {
          id: 91,
          authorId: 3,
          authorNickname: '정원',
          policyId: null,
          policyTitle: null,
          category: 'FREE',
          title: '수정된 글',
          content: '<img src="/api/v1/files/2e5c2c2f-22c7-43a9-8d2c-8902a29b2b21">',
          viewCount: 0,
          createdAt: '2026-07-20T10:00:00',
        },
      },
    });

    await updateCommunityPost('91', {
      title: '수정된 글',
      category: '잡담',
      content: '<img src="/api/v1/files/2e5c2c2f-22c7-43a9-8d2c-8902a29b2b21">',
      authorId: '3',
      authorName: '정원',
    });

    expect(apiClientMock.patch).toHaveBeenCalledWith('/v1/posts/91', {
      category: 'FREE',
      title: '수정된 글',
      content: '<img src="/api/v1/files/2e5c2c2f-22c7-43a9-8d2c-8902a29b2b21">',
      policyId: null,
      attachmentUrls: ['/api/v1/files/2e5c2c2f-22c7-43a9-8d2c-8902a29b2b21'],
    });
  });

  it('게시글 삭제 시 실제 DELETE API를 호출한다', async () => {
    apiClientMock.delete.mockResolvedValue({ data: { data: null } });

    await expect(deleteCommunityPost('91')).resolves.toBeUndefined();
    expect(apiClientMock.delete).toHaveBeenCalledWith('/v1/posts/91');
  });

  it('목록 조회는 페이지 파라미터로 실제 GET API를 호출하고 페이지 결과로 변환한다', async () => {
    apiClientMock.get.mockResolvedValue({
      data: {
        data: [
          {
            id: 91,
            authorId: 3,
            authorNickname: '정원',
            policyId: null,
            policyTitle: null,
            category: 'FREE',
            title: '목록 글',
            viewCount: 5,
            createdAt: '2026-07-20T10:00:00',
          },
        ],
        meta: { page: 1, totalCount: 1, totalPages: 1 },
      },
    });

    const result = await fetchCommunityPosts({ page: 1, pageSize: 6 });

    expect(apiClientMock.get).toHaveBeenCalledWith('/v1/posts', {
      params: { page: 1, size: 6, sort: 'createdAt,desc' },
    });
    expect(result).toEqual({
      items: [
        expect.objectContaining({ id: '91', title: '목록 글', category: '잡담', content: '' }),
      ],
      page: 1,
      pageSize: 6,
      totalCount: 1,
    });
  });
});
