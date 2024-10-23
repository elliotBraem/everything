import Header from "@/components/header";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
  component: LayoutComponent
});

function LayoutComponent() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Outlet />
    </ThemeProvider>
  );
}
