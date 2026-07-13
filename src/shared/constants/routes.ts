export const ROUTES = {
  home: '/',
  search: '/search',
  recommend: '/recommend',
  tracker: '/tracker',
  community: '/community',
  communityWrite: '/community/write',
  communityDetail: '/community/:postId',
  my: '/my',
  login: '/login',
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
