export type CommunityPostCategory = '정책질문' | '정책후기' | '잡담';

// 게시글에 첨부된 정책의 요약 정보. entities 간 결합을 피하기 위해 Policy 전체가 아닌
// 표시에 필요한 필드만 담는다.
export interface AttachedPolicySummary {
  id: string;
  title: string;
  category: string;
  deadline: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  category: CommunityPostCategory;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  attachedPolicy: AttachedPolicySummary | null;
}
