import { useWeb4Auth } from "@/hooks/use-web4-auth";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { Button } from "../ui/button";

export const WindowControls = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isSignedIn, accountId, logout } = useWeb4Auth();

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Inventory", path: "/inventory" }
  ];

  return (
    <div className="relative border-b-2 border-gray-800">
      <div className="flex items-center justify-end">
        <div>
          {/* <ThemeToggle /> */}
          {isSignedIn ? (
            <Button asChild className="h-7">
              <Link to={`/profile/${accountId}`}>{accountId}</Link>
            </Button>
          ) : (
            <Button asChild className="h-7">
              <Link to="/login">Connect NEAR Account</Link>
            </Button>
          )}
        </div>
        <div
          className="mx-4 my-3 h-4 w-4 cursor-pointer rounded-full bg-black transition-opacity hover:opacity-80"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-4 top-8 z-50 w-48 border-2 border-gray-800 bg-white shadow-[2px_2px_0_rgba(0,0,0,1)]"
          >
            {menuItems.map((item) => (
              <button
                key={item.path}
                className="w-full px-4 py-2 text-left font-mono transition-colors hover:bg-gray-100"
                onClick={() => {
                  navigate({ to: `/${item.path}` });
                  setIsOpen(false);
                }}
              >
                {item.label}
              </button>
            ))}
            {isSignedIn ? (
              <button
                key={"logout"}
                className="w-full px-4 py-2 text-left font-mono transition-colors hover:bg-gray-100"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
              >
                Logout
              </button>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface WindowContainerProps {
  children: ReactNode;
}

export default function WindowContainer({ children }: WindowContainerProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto min-h-[790px] max-w-4xl border-2 border-gray-800 bg-white shadow-[4px_4px_0_rgba(0,0,0,1)]"
    >
      <WindowControls />
      <div className="p-8">{children}</div>
      <footer className="fixed bottom-0 right-0 m-4">
        <div className="flex items-center gap-4">
          <div className="w-36 text-gray-500">
            <img src="/built-on-near.svg" alt="built on near" />
          </div>
          <a
            href={"https://github.com/elliotBraem/inventory-management"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-mono text-gray-500 transition-colors hover:text-gray-700"
          >
            <span>view source</span>
            <div className="text-gray-500 transition-colors hover:text-gray-700">
              <GitHubLogoIcon className="h-5 w-5" />
            </div>
          </a>
        </div>
      </footer>
    </motion.div>
  );
}
