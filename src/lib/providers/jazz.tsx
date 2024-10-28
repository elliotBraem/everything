import { SignInButton, useAuth, useClerk } from "@clerk/clerk-react";
import { useLocation } from "@tanstack/react-router";
import { createJazzReactApp } from "jazz-react";
import { useJazzClerkAuth } from "jazz-react-auth-clerk";
import { AuthMethod } from "jazz-tools";
import { UserAccount } from "@/lib/schema";

const Jazz = createJazzReactApp<UserAccount>({
  AccountSchema: UserAccount
});

export const { useAccount, useAccountOrGuest, useCoState, useAcceptInvite } =
  Jazz;

function assertPeerUrl(
  url: string | undefined
): asserts url is `wss://${string}` | `ws://${string}` {
  if (!url) {
    throw new Error("JAZZ_PEER_URL is not defined");
  }
  if (!url.startsWith("wss://") && !url.startsWith("ws://")) {
    throw new Error("JAZZ_PEER_URL must start with wss:// or ws://");
  }
}

const JAZZ_PEER_URL = (() => {
  // const rawUrl = getEnvVariable("VITE_JAZZ_PEER_URL")

  const rawUrl = "wss://cloud.jazz.tools/?key=you@example.com";
  assertPeerUrl(rawUrl);
  return rawUrl;
})();

interface ChildrenProps {
  children: React.ReactNode;
}

export function JazzAndAuth({ children }: ChildrenProps) {
  const { pathname } = useLocation();
  const Component = pathname === "/" ? JazzGuest : JazzAuth;
  return <Component>{children}</Component>;
}

export function JazzAuth({ children }: ChildrenProps) {
  const clerk = useClerk();
  const { isLoaded, isSignedIn } = useAuth();
  const [auth, state] = useJazzClerkAuth(clerk);

  // if (!isLoaded) return <p>loading...</p>;
  if (!isSignedIn) return <JazzGuest>{children}</JazzGuest>;
  if (!auth) return <p>no auth!</p>;

  return (
    <>
      <JazzProvider auth={auth}>{children}</JazzProvider>
    </>
  );
}

export function JazzGuest({ children }: ChildrenProps) {
  return <JazzProvider auth="guest">{children}</JazzProvider>;
}

function JazzProvider({
  auth,
  children
}: {
  auth: AuthMethod | "guest";
  children: React.ReactNode;
}) {
  return (
    <>
      <Jazz.Provider auth={auth} peer={JAZZ_PEER_URL}>
        {children}
      </Jazz.Provider>
    </>
  );
}
