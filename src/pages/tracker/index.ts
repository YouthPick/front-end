export { TrackerPage } from "./ui/TrackerPage";
import type { AppPageRoute } from "../page-routes";

export const trackerPageRoute: AppPageRoute = {
  view: "tracker",
  path: "/tracker",
  label: "신청 관리",
  requiresAuth: true,
};
