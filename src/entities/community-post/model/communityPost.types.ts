export type CommunityPostCategory = '정책질문' | '정책후기' | '잡담';

export interface CommunityPost {
  id: string;
  title: string;
  category: CommunityPostCategory;
  content: string;
  authorName: string;
  createdAt: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
}
