import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import App from "@app";

const rootRoute = createRootRoute({
  component: App,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "search",
});

const recommendRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "recommend",
});

const trackerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "tracker",
});

const mypageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "mypage",
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "admin",
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "login",
});

const loginCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "login/callback",
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "profile",
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  searchRoute,
  recommendRoute,
  trackerRoute,
  mypageRoute,
  adminRoute,
  loginRoute,
  loginCallbackRoute,
  profileRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
