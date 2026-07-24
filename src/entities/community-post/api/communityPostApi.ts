import { type ApiPageEnvelope, apiClient, toPageResult } from '@/shared/api';
import type { PageParams, PageResult } from '@/shared/types';
import { normalizeCommunityPostCategory } from '../model/communityCategories';
import type { AttachedPolicySummary, CommunityPostCategory } from '../model/communityPost.types';
import type { CommunityPostSortOption } from '../model/communityPostSort';
import type { CommunityPostDto } from './communityPost.dto';

// 게시글 조회/생성/수정/삭제는 모두 실서버(/v1/posts)를 사용한다.
// mock 게시글 배열 기반이던 searchCommunityPosts(마이페이지 내가 쓴 글/좋아요한 글)와
// adjustCommunityPostLikeCount(좋아요 수 갱신)는 실서버 게시글 id와 mock 배열이 어긋나
// 항상 빗나가는 문제가 있어 제거했다 — 좋아요 수 patch는 features/community-like에서
// 캐시 기준 ±1로 직접 계산하고, 마이페이지 목록은 백엔드 API가 생길 때까지 "준비 중"으로 둔다.

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
  contentExcerpt: string;
  viewCount: number;
  createdAt: string;
}

// 목록 응답(PostSummaryResponse)에는 commentCount/likeCount와 첨부 정책의
// category/deadline이 없다. 카드 미리보기 본문은 서버가 잘라 보내는 contentExcerpt를
// 그대로 쓰고, 첨부 정책은 policyId/policyTitle만으로 배지를 채운다(전체 정보는 상세에서만
// 가능). 댓글·좋아요 수는 0으로 채우고 각 위젯이 별도로 채워 넣는다
// (CommunityPostGrid의 useCommunityCommentCounts 등).
function mapPostSummaryToDto(dto: PostSummaryResponseDto): CommunityPostDto {
  return {
    id: String(dto.id),
    title: dto.title,
    category: categoryFromApi[dto.category],
    content: dto.contentExcerpt ?? '',
    authorId: String(dto.authorId),
    authorName: dto.authorNickname,
    createdAt: dto.createdAt.slice(0, 10),
    viewCount: dto.viewCount,
    commentCount: 0,
    likeCount: 0,
    attachedPolicy: null,
    policyId: dto.policyId === null ? null : String(dto.policyId),
    policyTitle: dto.policyTitle,
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

// 상세 응답(PostDetailResponse)에도 commentCount/likeCount가 없어 0으로 채운다.
// 좋아요 수는 백엔드 집계 API가 생길 때까지 features/community-like가 토글 시
// 캐시에서 ±1로 직접 갱신하는 임시 표시값이다.
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
    policyTitle: dto.policyTitle,
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
