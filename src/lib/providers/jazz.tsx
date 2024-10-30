import { useJazzWeb4Auth } from "@/hooks/use-web4-auth";
import { UserAccount } from "@/lib/schema";
import { useLocation } from "@tanstack/react-router";
import { createJazzReactApp } from "jazz-react";
import { AuthMethod } from "jazz-tools";

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
  const rawUrl = "wss://cloud.jazz.tools/?key=elliot@nearbuilders.org";
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
  const [auth, state] = useJazzWeb4Auth();

  // if (!isLoaded) return <p>loading...</p>;
  if (!auth) return <JazzGuest>{children}</JazzGuest>;

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
