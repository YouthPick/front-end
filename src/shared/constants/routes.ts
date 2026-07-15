export const ROUTES = {
  home: '/',
  search: '/search',
  recommend: '/recommend',
  tracker: '/tracker',
  community: '/community',
  communityWrite: '/community/write',
  communityDetail: '/community/:postId',
  my: '/my',
  myLikedPosts: '/my/liked',
  myPosts: '/my/posts',
  login: '/login',
  // 백엔드 OAuthProperties.frontend-callback-uri와 반드시 동일한 경로여야 한다.
  oauthCallback: '/oauth/callback',
  profileSetup: '/profile/setup',
  admin: '/admin',
  adminLogsLogin: '/admin/logs/login',
  adminLogsApplication: '/admin/logs/application',
  adminLogsSearch: '/admin/logs/search',
  adminLogsBatch: '/admin/logs/batch',
  adminUsers: '/admin/users',
  adminPolicies: '/admin/policies',
  adminApplications: '/admin/applications',
  adminCommunity: '/admin/community',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export function buildCommunityDetailPath(postId: string): string {
  return ROUTES.communityDetail.replace(':postId', encodeURIComponent(postId));
}
