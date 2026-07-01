export type AppView =
  | "home"
  | "search"
  | "recommend"
  | "tracker"
  | "mypage"
  | "admin"
  | "login"
  | "profile_setup";

export interface AppPageRoute {
  view: AppView;
  path: string;
  label: string;
  requiresAuth?: boolean;
}
