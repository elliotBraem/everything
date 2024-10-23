import Header from "@/components/header";
import { JazzAuth } from "@/lib/providers/jazz";
import NearProvider from "@/lib/providers/near";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Link,
  Outlet,
  createRootRouteWithContext
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Suspense } from "react";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
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
      <Outlet />
      {/* <NearProvider>
        <JazzAuth>
          <div className="min-h-screen">
            <Header />

            <main className="container mx-auto px-4 py-8">
              <Outlet />
            </main>
          </div>
        </JazzAuth>
      </NearProvider> */}
      <Suspense>
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <TanStackRouterDevtools position="bottom-right" />
      </Suspense>
    </>
  );
}
