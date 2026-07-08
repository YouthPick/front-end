export const ROUTES = {
  home: '/',
  search: '/search',
  recommend: '/recommend',
  tracker: '/tracker',
  my: '/my',
  login: '/login',
  profileSetup: '/profile/setup',
  admin: '/admin',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
