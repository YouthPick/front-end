import type { ApiErrorResponse } from '@/shared/api';

// 백엔드 CommentErrorCode 중 댓글 API가 실제로 내려주는 코드만 매핑한다.
const COMMENT_ERROR_MESSAGE_BY_CODE: Record<string, string> = {
  C001: '입력값을 다시 확인해 주세요.',
  B006: '이미 삭제되었거나 존재하지 않는 댓글입니다.',
  B007: '작성자만 댓글을 수정하거나 삭제할 수 있습니다.',
  B008: '답글에는 답글을 남길 수 없습니다.',
};

const FALLBACK_MESSAGE = '요청 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.';

export function getCommentErrorMessage(error: ApiErrorResponse | null): string {
  if (!error) return FALLBACK_MESSAGE;
  return COMMENT_ERROR_MESSAGE_BY_CODE[error.code] ?? FALLBACK_MESSAGE;
}
