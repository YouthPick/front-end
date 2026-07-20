import { apiClient } from '@/shared/api';
import { MOCK_API_DELAY_MS } from '@/shared/constants';
import { delay, matchesTextQuery } from '@/shared/utils';
import type { AttachedPolicySummary, CommunityPostCategory } from '../model/communityPost.types';
import type { CommunityPostSortOption } from '../model/communityPostSort';
import type { CommunityPostDto } from './communityPost.dto';
import { MOCK_COMMUNITY_POST_DTOS } from './communityPostMockData';

// 백엔드 API가 준비되면 이 파일의 mock 구현만 apiClient 호출로 교체한다.

let posts: CommunityPostDto[] = [...MOCK_COMMUNITY_POST_DTOS];

export interface CommunityPostSearchParams {
  query?: string;
  category?: string;
  sort?: CommunityPostSortOption;
  authorId?: string;
}

function cloneDto(dto: CommunityPostDto): CommunityPostDto {
  return { ...dto, attachedPolicy: dto.attachedPolicy ? { ...dto.attachedPolicy } : null };
}

function matchesSearchParams(post: CommunityPostDto, params: CommunityPostSearchParams): boolean {
  if (!matchesTextQuery([post.title, post.content], params.query)) {
    return false;
  }

  if (params.category && params.category !== '전체' && post.category !== params.category) {
    return false;
  }

  if (params.authorId && post.authorId !== params.authorId) {
    return false;
  }

  return true;
}

function sortPosts(
  posts: CommunityPostDto[],
  sort: CommunityPostSortOption | undefined,
): CommunityPostDto[] {
  const sorted = [...posts];
  switch (sort) {
    case 'views':
      return sorted.sort((a, b) => b.viewCount - a.viewCount);
    case 'comments':
      return sorted.sort((a, b) => b.commentCount - a.commentCount);
    case 'likes':
      return sorted.sort((a, b) => b.likeCount - a.likeCount);
    default:
      return sorted.sort((a, b) =>
        a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0,
      );
  }
}

export async function searchCommunityPosts(
  params: CommunityPostSearchParams,
): Promise<CommunityPostDto[]> {
  await delay(MOCK_API_DELAY_MS);
  const filtered = posts.filter((post) => matchesSearchParams(post, params));
  return sortPosts(filtered, params.sort).map(cloneDto);
}

export async function fetchCommunityPost(postId: string): Promise<CommunityPostDto | null> {
  const response = await apiClient.get<{ data: PostDetailResponseDto }>(`/v1/posts/${postId}`);
  return mapPostDetailToCommunityPost(response.data.data);
}

// 좋아요 토글 시 집계 좋아요 수를 함께 갱신한다. delta는 +1(좋아요) 또는 -1(좋아요 취소).
export async function adjustCommunityPostLikeCount(
  postId: string,
  delta: 1 | -1,
): Promise<CommunityPostDto | null> {
  await delay(MOCK_API_DELAY_MS);
  let updated: CommunityPostDto | null = null;
  posts = posts.map((post) => {
    if (post.id !== postId) return post;
    updated = { ...post, likeCount: Math.max(0, post.likeCount + delta) };
    return updated;
  });
  return updated ? cloneDto(updated) : null;
}

export interface CreateCommunityPostParams {
  title: string;
  category: CommunityPostCategory;
  content: string;
  authorId: string;
  authorName: string;
  attachedPolicy?: AttachedPolicySummary | null;
}

interface PostDetailResponseDto {
  id: number;
  authorId: number;
  authorNickname: string;
  policyId: number | null;
  policyTitle: string | null;
  category: 'QUESTION' | 'REVIEW' | 'FREE';
  title: string;
  content: string;
  viewCount: number;
  createdAt: string;
}

const categoryToApi: Record<CommunityPostCategory, PostDetailResponseDto['category']> = {
  정책질문: 'QUESTION',
  정책후기: 'REVIEW',
  잡담: 'FREE',
};

const categoryFromApi: Record<PostDetailResponseDto['category'], CommunityPostCategory> = {
  QUESTION: '정책질문',
  REVIEW: '정책후기',
  FREE: '잡담',
};

function extractUploadedImageUrls(content: string): string[] {
  return [
    ...new Set(
      Array.from(
        content.matchAll(/(?:src=["'])?(\/api\/v1\/files\/[0-9a-fA-F-]{36})/g),
        (match) => match[1],
      ),
    ),
  ];
}

function mapPostDetailToCommunityPost(dto: PostDetailResponseDto): CommunityPostDto {
  return {
    id: String(dto.id),
    title: dto.title,
    category: categoryFromApi[dto.category],
    content: dto.content,
    authorId: String(dto.authorId),
    authorName: dto.authorNickname,
    createdAt: dto.createdAt.slice(0, 10),
    viewCount: dto.viewCount,
    commentCount: 0,
    likeCount: 0,
    attachedPolicy: null,
    policyId: dto.policyId === null ? null : String(dto.policyId),
  };
}

export async function updateCommunityPost(
  postId: string,
  params: CreateCommunityPostParams,
): Promise<CommunityPostDto> {
  const response = await apiClient.patch<{ data: PostDetailResponseDto }>(`/v1/posts/${postId}`, {
    category: categoryToApi[params.category],
    title: params.title,
    content: params.content,
    policyId: params.attachedPolicy ? Number(params.attachedPolicy.id) : null,
    attachmentUrls: extractUploadedImageUrls(params.content),
  });

  return mapPostDetailToCommunityPost(response.data.data);
}

export async function deleteCommunityPost(postId: string): Promise<void> {
  await apiClient.delete(`/v1/posts/${postId}`);
}

export async function createCommunityPost(
  params: CreateCommunityPostParams,
): Promise<CommunityPostDto> {
  const response = await apiClient.post<{ data: PostDetailResponseDto }>('/v1/posts', {
    category: categoryToApi[params.category],
    title: params.title,
    content: params.content,
    policyId: params.attachedPolicy ? Number(params.attachedPolicy.id) : null,
    attachmentUrls: extractUploadedImageUrls(params.content),
  });

  return mapPostDetailToCommunityPost(response.data.data);
}
