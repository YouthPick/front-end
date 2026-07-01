export { LoginPage } from "./ui/LoginPage";
import type { AppPageRoute } from "../page-routes";

export const loginPageRoute: AppPageRoute = {
  view: "login",
  path: "/login",
  label: "로그인",
};
