export { RecommendPage } from "./ui/RecommendPage";
import type { AppPageRoute } from "../page-routes";

export const recommendPageRoute: AppPageRoute = {
  view: "recommend",
  path: "/recommend",
  label: "맞춤 추천",
  requiresAuth: true,
};
