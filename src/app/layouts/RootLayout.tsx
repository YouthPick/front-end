import { Outlet, ScrollRestoration } from "react-router";

import { ToastContainer } from "@/shared/ui";
import { Footer, NoticeBanner } from "@/widgets/footer";
import { Header } from "@/widgets/header";
import { MobileNav } from "@/widgets/mobile-nav";
import { PolicyDetailModalContainer } from "@/widgets/policy-detail-modal";

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f8fafc]" id="app-root">
      <ToastContainer />

      <Header />

      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-8 sm:px-6">
        <Outlet />
        <NoticeBanner />
      </main>

      <MobileNav />

      <Footer />

      <PolicyDetailModalContainer />

      <ScrollRestoration />
    </div>
  );
}
