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
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export function buildCommunityDetailPath(postId: string): string {
  return ROUTES.communityDetail.replace(':postId', encodeURIComponent(postId));
}
