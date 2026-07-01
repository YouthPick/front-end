export { MyPage } from "./ui/MyPage";
import type { AppPageRoute } from "../page-routes";

export const mypageRoute: AppPageRoute = {
  view: "mypage",
  path: "/mypage",
  label: "마이페이지",
  requiresAuth: true,
};
