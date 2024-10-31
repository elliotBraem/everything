import WindowContainer from "@/components/common/window-container";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_layout/(landing)/")({
  component: RootComponent
});

interface FeatureProps {
  title: string;
  icon: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const Feature = ({
  title,
  icon,
  description,
  isSelected,
  onClick,
  disabled
}: FeatureProps) => (
  <motion.button
    whileHover={{ scale: disabled ? 1 : 1.02 }}
    whileTap={{ scale: disabled ? 1 : 0.98 }}
    className={`relative flex flex-col items-center border border-gray-300 p-6 ${
      disabled
        ? "cursor-not-allowed opacity-70"
        : isSelected
          ? "z-20 -translate-y-1 bg-black text-white shadow-[2px_2px_0_rgba(0,0,0,1)]"
          : "z-10 bg-white text-black shadow-[1px_1px_0_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0_rgba(0,0,0,0.3)]"
    }`}
    onClick={disabled ? undefined : onClick}
  >
    <span className="mb-3 text-4xl">{icon}</span>
    <h3 className="mb-2 font-mono text-lg lowercase">{title}</h3>
    <p className="font-mono text-sm opacity-80">{description}</p>
    {disabled && (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-5">
        <div className="rounded-md bg-black bg-opacity-80 px-3 py-1">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-white" />
            <span className="font-mono text-sm text-white">tbd...</span>
          </div>
        </div>
      </div>
    )}
  </motion.button>
);

export default function RootComponent() {
  return (
    <div className="mb-16 p-6">
      <LandingPage />
    </div>
  );
}

function LandingPage() {
  const [selectedFeature, setSelectedFeature] = useState("create");

  const features = {
    create: {
      icon: "🤖",
      description: "ai agent to create typed data from natural language",
      disabled: false
    },
    store: {
      icon: "💾",
      description: "local-first, decentralized data storage",
      disabled: false
    },
    ask: {
      icon: "❓",
      description: "ai agent to ask questions about your inventory",
      disabled: true
    },
    generate: {
      icon: "✨",
      description: "ai agent to generate ui for your data structures",
      disabled: true
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-16 text-center"
      >
        <motion.h1
          className="relative mb-4 inline-block cursor-pointer font-mono text-7xl font-bold lowercase"
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
        >
          everything
        </motion.h1>
        <motion.p className="font-mono text-xl text-gray-600">
          your personal inventory for the user-owned internet
        </motion.p>
      </motion.div>

      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-2">
        <AnimatePresence>
          {Object.entries(features).map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Feature
                title={key}
                icon={value.icon}
                description={value.description}
                isSelected={selectedFeature === key}
                onClick={() => setSelectedFeature(key)}
                disabled={value.disabled}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
