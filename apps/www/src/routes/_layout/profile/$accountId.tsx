import { lazy, Suspense } from "react";
const Profile = lazy(() => import("profile/App"));
import { useWeb4Auth } from "@/hooks/use-web4-auth";
import { getImageUrl, getProfile, Profile as ProfileType } from "@/lib/social";
import { createFileRoute } from "@tanstack/react-router";

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

const fallbackUrl =
  "https://ipfs.near.social/ipfs/bafkreibmiy4ozblcgv3fm3gc6q62s55em33vconbavfd2ekkuliznaq3zm";

const Avatar: React.FC<{ url?: string; alt: string }> = ({ url, alt }) => (
  <img
    src={url ?? fallbackUrl}
    alt={alt}
    className="h-full w-full rounded-full border-4 border-white object-cover"
  />
);

const ProfileView: React.FC<{ profile: ProfileType }> = ({ profile }) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Profile profile={profile} />
  </Suspense>

);
