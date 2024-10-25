import Header from "@/components/header";
import { ThemeProvider } from "@/lib/providers/theme";
import { JazzAuth } from "@/lib/providers/jazz";
import NearProvider from "@/lib/providers/near";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Link,
  Outlet,
  createRootRouteWithContext
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

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
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <NearProvider>
          <ClerkProvider
            publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
            afterSignOutUrl="/"
          >
            <JazzAuth>
              <div className="min-h-screen">
                <Header />

                <main className="container mx-auto px-4 py-8">
                  <Outlet />
                </main>
              </div>
            </JazzAuth>
          </ClerkProvider>
        </NearProvider>
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <TanStackRouterDevtools position="bottom-right" />
      </ThemeProvider>
    </>
  );
}
