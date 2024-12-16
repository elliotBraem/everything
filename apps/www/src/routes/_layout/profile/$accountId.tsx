import { useWeb4Auth } from "@/hooks/use-web4-auth";
import { getProfile, Profile as ProfileType } from "@/lib/social";
import { createFileRoute } from "@tanstack/react-router";
import { Component, lazy, Suspense } from "react";

const Profile = lazy(() => import("profile/App"));

class ProfileErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Profile error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center">
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p>Unable to load profile. Please try again later.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export const Route = createFileRoute("/_layout/profile/$accountId")({
  loader: async ({ params }) => {
    try {
      return await getProfile(params.accountId);
    } catch (error) {
      // Return null to indicate profile fetch failed
      return null;
    }
  },
  component: ProfilePage
});

export function ProfilePage() {
  const { accountId } = useWeb4Auth();
  const data = Route.useLoaderData();

  // If profile fetch failed, use fallback data
  const fallbackProfile: ProfileType = {
    name: accountId || "Anonymous",
    description: "",
    image: undefined,
    backgroundImage: undefined
  };

  return <ProfileView profile={data || fallbackProfile} />;
}

const ProfileView: React.FC<{ profile: ProfileType }> = ({ profile }) => (
  <ProfileErrorBoundary>
    <Suspense fallback={<div>Loading...</div>}>
      <Profile profile={profile} />
    </Suspense>
  </ProfileErrorBoundary>
);
