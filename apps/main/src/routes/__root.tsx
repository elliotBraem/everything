import Header from "@/components/header";
import { NotFound } from "@/components/not-found";
import { JazzAuth } from "@/lib/providers/jazz";
import NearProvider from "@/lib/providers/near";
import { ThemeProvider } from "@/lib/providers/theme";
import { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import Cookies from "js-cookie";
import React from "react";

export const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : React.lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools
        }))
      );

export const ReactQueryDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : React.lazy(() =>
        import("@tanstack/react-query-devtools").then((d) => ({
          default: d.ReactQueryDevtools
        }))
      );

export const Route = createRootRouteWithContext<{
  auth: { userId: string };
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  beforeLoad: async ({ context }) => {
    if (context.auth) {
      return { auth: context.auth };
    }
    const auth = !!Cookies.get("web4_account_id");
    return { auth };
  },
  notFoundComponent: NotFound
});

function RootComponent() {
  return (
    <>
      {/* <AuthDebugger /> */}
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        {/* May not need Near Provider, and Jazz Provider maybe should be combined */}
        <NearProvider>
          <JazzAuth>
            <Outlet />
          </JazzAuth>
        </NearProvider>
        <React.Suspense>
          <TanStackRouterDevtools position="bottom-left" />
          <ReactQueryDevtools buttonPosition="bottom-left" />
        </React.Suspense>
      </ThemeProvider>
    </>
  );
}
