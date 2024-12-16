import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  server: {
    port: 5170
  },
  base: "http://localhost:5170",
  plugins: [
    react(),
    federation({
      name: "profile",
      exposes: {
        "./App": "./src/App.jsx"
      },
      filename: "profile/remoteEntry.js",
      shared: {
        react: {
          requiredVersion: "18"
        },
        "react-dom": {}
      }
    }),
    nodePolyfills({ globals: { global: true } }),
    topLevelAwait()
  ],
});
