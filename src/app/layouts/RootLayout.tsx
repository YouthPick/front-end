import { Suspense } from 'react';
import { Outlet, ScrollRestoration } from 'react-router';

import { CompareDockContainer } from '@/features/policy-compare';
import { Skeleton, ToastContainer } from '@/shared/ui';
import { NoticeBanner } from '@/widgets/footer';
import { Header } from '@/widgets/header';
import { MobileNav } from '@/widgets/mobile-nav';
import { PolicyDetailModalContainer } from '@/widgets/policy-detail-modal';

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-between pb-16 md:pb-0" id="app-root">
      <ToastContainer />

      <Header />

      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-8 sm:px-6">
        <Suspense
          fallback={
            <div className="space-y-4">
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-56" />
              <Skeleton className="h-56" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
        <NoticeBanner />
      </main>

      <MobileNav />

      <PolicyDetailModalContainer />

      <CompareDockContainer />

      <ScrollRestoration />
    </div>
  );
}
