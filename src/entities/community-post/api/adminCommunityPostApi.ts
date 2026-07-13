import { MOCK_API_DELAY_MS } from '@/shared/constants';
import type { PageParams, PageResult } from '@/shared/types';
import { delay, paginate } from '@/shared/utils';

import type {
  AdminAttachmentDto,
  AdminCommunityCommentDto,
  AdminCommunityPostDto,
} from './adminCommunityPost.dto';
import {
  MOCK_ADMIN_ATTACHMENT_DTOS,
  MOCK_ADMIN_COMMUNITY_COMMENT_DTOS,
  MOCK_ADMIN_COMMUNITY_POST_DTOS,
} from './adminCommunityPostMockData';

// 백엔드 API가 준비되면 이 파일의 mock 구현만 apiClient 호출로 교체한다.

export interface AdminCommunityPostSearchParams extends PageParams {
  category?: string;
  authorId?: string;
  // "YYYY-MM-DD". 작성일(createdAt)이 이 범위 안에 있는 게시글만 조회한다.
  startDate?: string;
  endDate?: string;
}

const adminCommunityPosts: AdminCommunityPostDto[] = MOCK_ADMIN_COMMUNITY_POST_DTOS.map((dto) => ({
  ...dto,
}));
const adminCommunityComments: AdminCommunityCommentDto[] = MOCK_ADMIN_COMMUNITY_COMMENT_DTOS.map(
  (dto) => ({ ...dto }),
);

function matchesAdminCommunityPostParams(
  post: AdminCommunityPostDto,
  params: AdminCommunityPostSearchParams,
): boolean {
  if (params.category && post.category !== params.category) return false;
  if (params.authorId && post.authorId !== params.authorId) return false;
  if (params.startDate && post.createdAt < params.startDate) return false;
  if (params.endDate && post.createdAt > params.endDate) return false;
  return true;
}

export async function fetchAdminCommunityPosts(
  params: AdminCommunityPostSearchParams,
): Promise<PageResult<AdminCommunityPostDto>> {
  await delay(MOCK_API_DELAY_MS);

  const filtered = adminCommunityPosts.filter((post) =>
    matchesAdminCommunityPostParams(post, params),
  );
  const paged = paginate(filtered, params.page, params.pageSize);

  return { ...paged, items: paged.items.map((dto) => ({ ...dto })) };
}

export async function fetchAdminCommunityComments(
  postId: string,
): Promise<AdminCommunityCommentDto[]> {
  await delay(MOCK_API_DELAY_MS);
  return adminCommunityComments
    .filter((comment) => comment.postId === postId)
    .map((dto) => ({ ...dto }));
}

export async function fetchAdminCommunityAttachments(
  postId: string,
): Promise<AdminAttachmentDto[]> {
  await delay(MOCK_API_DELAY_MS);
  return MOCK_ADMIN_ATTACHMENT_DTOS.filter((attachment) => attachment.postId === postId).map(
    (dto) => ({ ...dto }),
  );
}

export async function softDeleteAdminCommunityPost(postId: string): Promise<AdminCommunityPostDto> {
  await delay(MOCK_API_DELAY_MS);

  const target = adminCommunityPosts.find((post) => post.id === postId);
  if (!target) throw new Error(`존재하지 않는 게시글입니다: ${postId}`);

  target.deletedAt = new Date().toISOString();
  return { ...target };
}

export async function softDeleteAdminCommunityComment(
  commentId: string,
): Promise<AdminCommunityCommentDto> {
  await delay(MOCK_API_DELAY_MS);

  const target = adminCommunityComments.find((comment) => comment.id === commentId);
  if (!target) throw new Error(`존재하지 않는 댓글입니다: ${commentId}`);

  target.deletedAt = new Date().toISOString();
  return { ...target };
}
