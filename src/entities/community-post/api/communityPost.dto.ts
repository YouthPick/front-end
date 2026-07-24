export interface AttachedPolicySummaryDto {
  id: string;
  title: string;
  category: string;
  deadline: string;
}

export interface CommunityPostDto {
  id: string;
  title: string;
  category: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  attachedPolicy: AttachedPolicySummaryDto | null;
  policyId?: string | null;
  policyTitle?: string | null;
}
