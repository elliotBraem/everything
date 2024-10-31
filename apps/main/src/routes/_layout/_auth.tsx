import { ActionButton } from "@/components/action-button";
import {
  Outlet,
  createFileRoute,
  redirect
} from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_auth")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href
        }
      });
    }
  },
  component: AuthLayout
});

function AuthLayout() {
  return (
    <>
      <Outlet />
      <ActionButton />
    </>
  );
}
