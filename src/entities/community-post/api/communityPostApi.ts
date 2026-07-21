import { type ApiPageEnvelope, apiClient, toPageResult } from '@/shared/api';
import { MOCK_API_DELAY_MS } from '@/shared/constants';
import type { PageParams, PageResult } from '@/shared/types';
import { delay, matchesTextQuery } from '@/shared/utils';
import { normalizeCommunityPostCategory } from '../model/communityCategories';
import type { AttachedPolicySummary, CommunityPostCategory } from '../model/communityPost.types';
import type { CommunityPostSortOption } from '../model/communityPostSort';
import type { CommunityPostDto } from './communityPost.dto';
import { MOCK_COMMUNITY_POST_DTOS } from './communityPostMockData';

// searchCommunityPosts는 마이페이지의 "내가 작성한 글"/"좋아요한 글"이 여전히 사용한다
// (백엔드에 작성자/좋아요 기준 조회 API가 아직 없어 전체 목록을 받아 클라이언트에서 거른다).
// 커뮤니티 메인 목록은 fetchCommunityPosts(실제 API)를 사용한다.

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

interface PostSummaryResponseDto {
  id: number;
  authorId: number;
  authorNickname: string;
  policyId: number | null;
  policyTitle: string | null;
  category: 'QUESTION' | 'REVIEW' | 'FREE';
  title: string;
  viewCount: number;
  createdAt: string;
}

// 목록 응답(PostSummaryResponse)에는 content/commentCount/likeCount가 없다.
// 카드 미리보기 본문은 빈 문자열로, 댓글·좋아요 수는 0으로 채우고 각 위젯이 별도로 채워 넣는다
// (CommunityPostGrid의 useCommunityCommentCounts 등).
function mapPostSummaryToDto(dto: PostSummaryResponseDto): CommunityPostDto {
  return {
    id: String(dto.id),
    title: dto.title,
    category: categoryFromApi[dto.category],
    content: '',
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

export interface CommunityPostPageSearchParams extends PageParams {
  category?: string;
  query?: string;
  sort?: CommunityPostSortOption;
}

// 백엔드 정렬 컬럼이 존재하는 옵션만 지원한다(댓글수/좋아요수는 Post 엔티티에 없음).
const SORT_PARAM_BY_OPTION: Record<CommunityPostSortOption, string> = {
  latest: 'createdAt,desc',
  views: 'viewCount,desc',
};

// '전체'나 알 수 없는 값은 필터 없음으로 취급한다.
function toBackendCategory(category?: string): PostSummaryResponseDto['category'] | undefined {
  if (!category) return undefined;
  const normalized = normalizeCommunityPostCategory(category);
  return normalized ? categoryToApi[normalized] : undefined;
}

// 커뮤니티 메인 목록: 서버 페이지네이션 + 검색어/카테고리 필터 + 정렬(최신순/조회수순).
export async function fetchCommunityPosts(
  params: CommunityPostPageSearchParams,
): Promise<PageResult<CommunityPostDto>> {
  const response = await apiClient.get<ApiPageEnvelope<PostSummaryResponseDto>>('/v1/posts', {
    params: {
      page: params.page,
      size: params.pageSize,
      sort: SORT_PARAM_BY_OPTION[params.sort ?? 'latest'],
      category: toBackendCategory(params.category),
      query: params.query || undefined,
    },
  });
  return toPageResult(
    { data: response.data.data.map(mapPostSummaryToDto), meta: response.data.meta },
    params.pageSize,
  );
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
