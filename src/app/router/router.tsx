import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';

import { HomePage } from '@/pages/home';
import { LoginPage } from '@/pages/login';
import { OAuthCallbackPage } from '@/pages/oauth-callback';
import { SearchPage } from '@/pages/search';
import { ROUTES } from '@/shared/constants';
import { AdminLayout } from '@/widgets/admin-layout';

import { RootLayout } from '../layouts/RootLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { RequireOnboarded } from './RequireOnboarded';

// 홈·검색·로그인 외 화면은 라우트 단위로 지연 로딩해 초기 번들을 줄인다.
const AdminPage = lazy(() => import('@/pages/admin').then((m) => ({ default: m.AdminPage })));
const AdminLoginLogsPage = lazy(() =>
  import('@/pages/admin-logs-login').then((m) => ({ default: m.AdminLoginLogsPage })),
);
const AdminApplicationLogsPage = lazy(() =>
  import('@/pages/admin-logs-application').then((m) => ({ default: m.AdminApplicationLogsPage })),
);
const AdminSearchLogsPage = lazy(() =>
  import('@/pages/admin-logs-search').then((m) => ({ default: m.AdminSearchLogsPage })),
);
const AdminBatchLogsPage = lazy(() =>
  import('@/pages/admin-logs-batch').then((m) => ({ default: m.AdminBatchLogsPage })),
);
const AdminUsersPage = lazy(() =>
  import('@/pages/admin-users').then((m) => ({ default: m.AdminUsersPage })),
);
const AdminPoliciesPage = lazy(() =>
  import('@/pages/admin-policies').then((m) => ({ default: m.AdminPoliciesPage })),
);
const AdminApplicationsPage = lazy(() =>
  import('@/pages/admin-applications').then((m) => ({ default: m.AdminApplicationsPage })),
);
const AdminCommunityPage = lazy(() =>
  import('@/pages/admin-community').then((m) => ({ default: m.AdminCommunityPage })),
);
const CommunityPage = lazy(() =>
  import('@/pages/community').then((m) => ({ default: m.CommunityPage })),
);
const CommunityEditPage = lazy(() =>
  import('@/pages/community-edit').then((m) => ({ default: m.CommunityEditPage })),
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
      { path: ROUTES.oauthCallback, element: <OAuthCallbackPage /> },
      {
        element: <ProtectedRoute requiredRole="admin" />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: ROUTES.admin, element: <AdminPage /> },
              { path: ROUTES.adminLogsLogin, element: <AdminLoginLogsPage /> },
              { path: ROUTES.adminLogsApplication, element: <AdminApplicationLogsPage /> },
              { path: ROUTES.adminLogsSearch, element: <AdminSearchLogsPage /> },
              { path: ROUTES.adminLogsBatch, element: <AdminBatchLogsPage /> },
              { path: ROUTES.adminUsers, element: <AdminUsersPage /> },
              { path: ROUTES.adminPolicies, element: <AdminPoliciesPage /> },
              { path: ROUTES.adminApplications, element: <AdminApplicationsPage /> },
              { path: ROUTES.adminCommunity, element: <AdminCommunityPage /> },
            ],
          },
        ],
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
          { path: ROUTES.communityEdit, element: <CommunityEditPage /> },
        ],
      },
      // 존재하지 않는 경로는 홈으로 보낸다.
      { path: '*', element: <Navigate to={ROUTES.home} replace /> },
    ],
  },
]);
