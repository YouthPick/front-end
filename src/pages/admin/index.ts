export { AdminPage } from "./ui/AdminPage";
import type { AppPageRoute } from "../page-routes";

export const adminPageRoute: AppPageRoute = {
  view: "admin",
  path: "/admin",
  label: "관리자",
};
