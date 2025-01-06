import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';
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
          requiredVersion: "18",
          singleton: true
        },
        "react-dom": {
          singleton: true
        }
      }
    })
  ];

  if (process.env.NODE_ENV !== 'development') {
    basePlugins.push(
      nodePolyfills({
        globals: { global: true },
        protocolImports: true
      })
    );
  }

  return {
    base: isProduction ? 'https://unpkg.com/@near-everything/profile@0.0.6/dist/' : '/',
    server: {
      port: 5170
    },
    plugins: basePlugins,
    build: {
      target: "chrome89",
      cssCodeSplit: false,
    }
  };
});
