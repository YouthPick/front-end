export interface AdminCommunityPost {
  id: string;
  title: string;
  category: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  viewCount: number;
  deletedAt: string | null;
}

export interface AdminCommunityComment {
  id: string;
  postId: string;
  parentCommentId: string | null;
  authorName: string;
  content: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface AdminAttachment {
  id: string;
  postId: string;
  fileKey: string;
  fileSize: number;
  createdAt: string;
}
