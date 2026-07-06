import { createBrowserRouter, Navigate } from "react-router";

import { AdminPage } from "@/pages/admin";
import { HomePage } from "@/pages/home";
import { LoginPage } from "@/pages/login";
import { MyPage } from "@/pages/my";
import { ProfileSetupPage } from "@/pages/profile-setup";
import { RecommendPage } from "@/pages/recommend";
import { SearchPage } from "@/pages/search";
import { TrackerPage } from "@/pages/tracker";
import { ROUTES } from "@/shared/constants";

import { RootLayout } from "../layouts/RootLayout";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: ROUTES.home, element: <HomePage /> },
      { path: ROUTES.search, element: <SearchPage /> },
      { path: ROUTES.login, element: <LoginPage /> },
      { path: ROUTES.admin, element: <AdminPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: ROUTES.recommend, element: <RecommendPage /> },
          { path: ROUTES.tracker, element: <TrackerPage /> },
          { path: ROUTES.my, element: <MyPage /> },
          { path: ROUTES.profileSetup, element: <ProfileSetupPage /> },
        ],
      },
      // 존재하지 않는 경로는 홈으로 보낸다.
      { path: "*", element: <Navigate to={ROUTES.home} replace /> },
    ],
  },
]);
