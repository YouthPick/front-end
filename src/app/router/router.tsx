import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';

import { HomePage } from '@/pages/home';
import { LoginPage } from '@/pages/login';
import { SearchPage } from '@/pages/search';
import { ROUTES } from '@/shared/constants';

import { RootLayout } from '../layouts/RootLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { RequireOnboarded } from './RequireOnboarded';

// 홈·검색·로그인 외 화면은 라우트 단위로 지연 로딩해 초기 번들을 줄인다.
const AdminPage = lazy(() => import('@/pages/admin').then((m) => ({ default: m.AdminPage })));
const CommunityPage = lazy(() =>
  import('@/pages/community').then((m) => ({ default: m.CommunityPage })),
);
const CommunityDetailPage = lazy(() =>
  import('@/pages/community-detail').then((m) => ({ default: m.CommunityDetailPage })),
);
const CommunityWritePage = lazy(() =>
  import('@/pages/community-write').then((m) => ({ default: m.CommunityWritePage })),
);
const MyPage = lazy(() => import('@/pages/my').then((m) => ({ default: m.MyPage })));
const MyLikedPostsPage = lazy(() =>
  import('@/pages/my-liked-posts').then((m) => ({ default: m.MyLikedPostsPage })),
);
const MyPostsPage = lazy(() =>
  import('@/pages/my-posts').then((m) => ({ default: m.MyPostsPage })),
);
const ProfileSetupPage = lazy(() =>
  import('@/pages/profile-setup').then((m) => ({ default: m.ProfileSetupPage })),
);
const RecommendPage = lazy(() =>
  import('@/pages/recommend').then((m) => ({ default: m.RecommendPage })),
);
const TrackerPage = lazy(() => import('@/pages/tracker').then((m) => ({ default: m.TrackerPage })));

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: ROUTES.home, element: <HomePage /> },
      { path: ROUTES.search, element: <SearchPage /> },
      { path: ROUTES.community, element: <CommunityPage /> },
      { path: ROUTES.communityDetail, element: <CommunityDetailPage /> },
      { path: ROUTES.login, element: <LoginPage /> },
      {
        element: <ProtectedRoute requiredRole="admin" />,
        children: [{ path: ROUTES.admin, element: <AdminPage /> }],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <RequireOnboarded />,
            children: [{ path: ROUTES.recommend, element: <RecommendPage /> }],
          },
          { path: ROUTES.tracker, element: <TrackerPage /> },
          { path: ROUTES.my, element: <MyPage /> },
          { path: ROUTES.myLikedPosts, element: <MyLikedPostsPage /> },
          { path: ROUTES.myPosts, element: <MyPostsPage /> },
          { path: ROUTES.profileSetup, element: <ProfileSetupPage /> },
          { path: ROUTES.communityWrite, element: <CommunityWritePage /> },
        ],
      },
      // 존재하지 않는 경로는 홈으로 보낸다.
      { path: '*', element: <Navigate to={ROUTES.home} replace /> },
    ],
  },
]);
