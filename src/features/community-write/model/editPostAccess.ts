import { isAxiosError } from 'axios';

import type { CommunityPost } from '@/entities/community-post';

// 글 수정 화면 진입 시 접근 상태.
// - create: 새 글 작성 모드 — 게시글 조회가 필요 없다.
// - loading: 수정 대상 게시글 조회 중 — 빈 폼 대신 스켈레톤을 보여준다.
// - error: 조회 실패(404 제외) — 재시도 가능한 에러 상태를 보여준다.
// - not-found: 존재하지 않거나 삭제된 게시글 — 안내 후 목록으로 보낸다.
// - forbidden: 작성자가 아닌 사용자의 접근 — 안내 후 상세로 보낸다.
// - allowed: 작성자 본인 확인 완료 — 수정 폼을 보여준다.
export type EditPostAccess = 'create' | 'loading' | 'error' | 'not-found' | 'forbidden' | 'allowed';

interface ResolveEditPostAccessParams {
  isEditMode: boolean;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  post: CommunityPost | null | undefined;
  currentUserId: string | undefined;
}

function isNotFoundError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 404;
}

// 수정 모드 접근 판정을 컴포넌트 밖 순수 함수로 분리해 단위 테스트를 가능하게 한다.
export function resolveEditPostAccess({
  isEditMode,
  isLoading,
  isError,
  error,
  post,
  currentUserId,
}: ResolveEditPostAccessParams): EditPostAccess {
  if (!isEditMode) return 'create';
  if (isLoading) return 'loading';
  if (isError) return isNotFoundError(error) ? 'not-found' : 'error';
  // 매퍼가 식별 불가 게시글을 null로 돌려주는 경우도 삭제된 글과 동일하게 처리한다.
  if (!post) return 'not-found';
  if (currentUserId === undefined || post.authorId !== currentUserId) return 'forbidden';
  return 'allowed';
}
