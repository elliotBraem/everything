import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import { useWeb4Auth } from "@/hooks/use-web4-auth";
import { Link } from "@tanstack/react-router";

export default function Header() {
  const { isSignedIn, accountId } = useWeb4Auth();

  return (
    <>
      <ThemeToggle />
      {isSignedIn ? (
        <Button asChild>
          <Link to={`/profile/${accountId}`}>{accountId}</Link>
        </Button>
      ) : (
        <Button asChild>
          <Link to="/login">Connect NEAR Account</Link>
        </Button>
      )}
    </>
  );
}
