// 게시글 목록의 댓글 수 배지(useCommunityCommentCounts)에만 쓰는 mock — 백엔드에 벌크 조회 API가 없어
// 실제 댓글 CRUD(communityComment.dto.ts)와는 별개 형태로 둔다.
export interface MockCommunityCommentCount {
  postId: string;
}

export const MOCK_COMMUNITY_COMMENT_COUNTS: MockCommunityCommentCount[] = [
  { postId: 'cp1' },
  { postId: 'cp1' },
  { postId: 'cp2' },
];
