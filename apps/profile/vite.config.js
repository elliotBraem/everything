import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig(({ command, mode }) => {
  // Base plugins that are always needed
  const basePlugins = [
    react(),
    federation({
      name: "profile",
      type: "remote",
      exposes: {
        "./App": "./src/App.jsx"
      },
      remotes: {},
      filename: "profile/remoteEntry.js",
      shared: {
        react: {
          requiredVersion: "18"
        },
        "react-dom": {}
      }
    })
  ];

  if (!process.env.NODE_ENV === 'development') {
    basePlugins.push(
      nodePolyfills({
        globals: { global: true },
        protocolImports: true
      })
    );
  }

  return {
    server: {
      port: 5170
    },
    base: "http://localhost:5170",
    plugins: basePlugins,
    build: {
      target: "chrome89"
    }
  };
});
