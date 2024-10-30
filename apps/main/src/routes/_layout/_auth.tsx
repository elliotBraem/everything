import { ActionButton } from "@/components/action-button";
import Header from "@/components/header";
import { useWeb4Auth } from "@/hooks/use-web4-auth";
import {
  Outlet,
  createFileRoute,
  redirect,
  useRouter
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
  const router = useRouter();
  const navigate = Route.useNavigate();
  const { isSignedIn, logout } = useWeb4Auth();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      // .then(() => {
      //   router.invalidate().finally(() => {
      //     navigate({ to: '/' })
      //   })
      // })
    }
  };

  return (
    <>
      {/* TODO: Header should have dropdown for login and logout */}
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <ActionButton />
    </>
  );
}
