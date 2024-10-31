import { Button } from "@/components/ui/button";
import { useWeb4Auth } from "@/hooks/use-web4-auth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Database, Key, Shield } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/_layout/login")({
  component: LoginPage
});

const Feature = ({
  icon: Icon,
  title,
  description
}: {
  icon: any;
  title: string;
  description: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-start gap-3 text-left"
  >
    <div className="mt-1 rounded-lg border-2 border-black p-2">
      <Icon className="h-4 w-4" />
    </div>
    <div>
      <h3 className="font-mono font-medium">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </motion.div>
);

export default function LoginPage() {
  const { isSignedIn, login } = useWeb4Auth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate({ to: "/" });
    }
  }, [isSignedIn]);

  const handleSignIn = () => {
    try {
      login("/inventory");
    } catch (e) {
      console.error("Wallet not configured properly");
    }
  };

  return (
    <div className="m-12 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full"
      >
        <div className="mb-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 font-mono text-4xl font-bold"
          >
            connect to everything
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600"
          >
            Your universal key to the decentralized universe
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8 space-y-6"
        >
          <Feature
            icon={Shield}
            title="User-Owned Data"
            description="Full control over your digital inventory"
          />
          <Feature
            icon={Database}
            title="Universal Storage"
            description="One place for all your digital assets"
          />
          <Feature
            icon={Key}
            title="Secure Access"
            description="Login with your NEAR wallet"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={handleSignIn}
            className="group w-full text-base"
            size="lg"
          >
            <span>Connect Wallet</span>
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-center text-sm text-gray-500"
        >
          By connecting, you agree to our{" "}
          <a href="#" className="underline hover:text-gray-800">
            Terms of Service
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
