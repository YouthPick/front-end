import type { CommunityCommentDto } from './communityComment.dto';

export const MOCK_COMMUNITY_COMMENT_DTOS: CommunityCommentDto[] = [
  {
    id: 'cc1',
    postId: 'cp1',
    parentId: null,
    authorName: '월세지원러',
    authorEmail: 'wolse@example.com',
    content: '부모님과 세대 분리가 되어 있으면 부모님 소득은 합산되지 않아요!',
    createdAt: '2026-07-08',
  },
  {
    id: 'cc2',
    postId: 'cp1',
    parentId: 'cc1',
    authorName: '토끼걸음',
    authorEmail: 'tokki@example.com',
    content: '오 감사합니다! 주민등록등본으로 확인하면 되겠네요.',
    createdAt: '2026-07-08',
  },
  {
    id: 'cc3',
    postId: 'cp2',
    parentId: null,
    authorName: '취준생B',
    authorEmail: 'jobseekerb@example.com',
    content: '저도 이번에 신청하려고 하는데 후기 감사합니다!',
    createdAt: '2026-07-07',
  },
];
