import type { AppPageRoute, AppView } from "./page-routes";

export type { AppPageRoute, AppView } from "./page-routes";

export const APP_PAGE_ROUTES: AppPageRoute[] = [
  { view: "home", path: "/", label: "홈" },
  { view: "search", path: "/search", label: "정책 검색" },
  { view: "recommend", path: "/recommend", label: "맞춤 추천", requiresAuth: true },
  { view: "tracker", path: "/tracker", label: "신청 관리", requiresAuth: true },
  { view: "mypage", path: "/mypage", label: "마이페이지", requiresAuth: true },
  { view: "admin", path: "/admin", label: "관리자" },
  { view: "login", path: "/login", label: "로그인" },
  { view: "profile_setup", path: "/profile", label: "프로필 설정" },
];

const ROUTE_BY_VIEW = new Map(APP_PAGE_ROUTES.map((route) => [route.view, route]));
const VIEW_BY_PATH = new Map(APP_PAGE_ROUTES.map((route) => [route.path, route.view]));

export function pathForView(view: AppView): string {
  return ROUTE_BY_VIEW.get(view)?.path ?? "/";
}

export function viewForPath(pathname: string): AppView {
  if (pathname === "/login/callback") {
    return "login";
  }
  return VIEW_BY_PATH.get(pathname) ?? "home";
}

export function routeForView(view: AppView): AppPageRoute {
  return ROUTE_BY_VIEW.get(view) ?? APP_PAGE_ROUTES[0];
}
