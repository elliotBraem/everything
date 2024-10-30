import Header from "@/components/header";
import { JazzAuth } from "@/lib/providers/jazz";
import NearProvider from "@/lib/providers/near";
import { ThemeProvider } from "@/lib/providers/theme";
import { QueryClient } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  createRootRouteWithContext
} from "@tanstack/react-router";
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
  notFoundComponent: () => {
    return (
      <div>
        <p>404 not found</p>
        <Link to="/">Go home</Link>
      </div>
    );
  }
});

function RootComponent() {
  return (
    <>
      {/* <AuthDebugger /> */}
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <NearProvider>
          <JazzAuth>
            <div className="min-h-screen">
              <Header />

              <main className="container mx-auto px-4 py-8">
                <Outlet />
              </main>
            </div>
          </JazzAuth>
        </NearProvider>
        <React.Suspense>
          <TanStackRouterDevtools position="bottom-right" />
          <ReactQueryDevtools buttonPosition="bottom-right" />
        </React.Suspense>
      </ThemeProvider>
    </>
  );
}
