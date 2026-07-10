import { MOCK_API_DELAY_MS } from '@/shared/constants';
import { delay, generateId, matchesTextQuery } from '@/shared/utils';
import type { CommunityPostCategory } from '../model/communityPost.types';
import type { CommunityPostSortOption } from '../model/communityPostSort';
import type { CommunityPostDto } from './communityPost.dto';
import { MOCK_COMMUNITY_POST_DTOS } from './communityPostMockData';

// 백엔드 API가 준비되면 이 파일의 mock 구현만 apiClient 호출로 교체한다.

let posts: CommunityPostDto[] = [...MOCK_COMMUNITY_POST_DTOS];

export interface CommunityPostSearchParams {
  query?: string;
  category?: string;
  sort?: CommunityPostSortOption;
}

function cloneDto(dto: CommunityPostDto): CommunityPostDto {
  return { ...dto };
}

function matchesSearchParams(post: CommunityPostDto, params: CommunityPostSearchParams): boolean {
  if (!matchesTextQuery([post.title, post.content], params.query)) {
    return false;
  }

  if (params.category && params.category !== '전체' && post.category !== params.category) {
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
  await delay(MOCK_API_DELAY_MS);
  const found = posts.find((post) => post.id === postId);
  return found ? cloneDto(found) : null;
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
  authorName: string;
}

export async function createCommunityPost(
  params: CreateCommunityPostParams,
): Promise<CommunityPostDto> {
  await delay(MOCK_API_DELAY_MS);
  const newPost: CommunityPostDto = {
    id: generateId(),
    title: params.title,
    category: params.category,
    content: params.content,
    authorName: params.authorName,
    // toISOString()은 UTC 기준이라 자정 근처 KST 시간대에 하루 어긋날 수 있어 KST 기준으로 포맷한다.
    createdAt: new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date()),
    viewCount: 0,
    commentCount: 0,
    likeCount: 0,
  };
  posts = [newPost, ...posts];
  return cloneDto(newPost);
}
