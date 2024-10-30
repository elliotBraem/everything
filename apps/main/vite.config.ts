import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import fs from 'fs';
import path from "path";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
    nodePolyfills({ globals: { global: true } })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  server: {
    host: 'every.near.page',
    https: {
      key: fs.readFileSync('./_wildcard.near.page-key.pem'),
      cert: fs.readFileSync('./_wildcard.near.page.pem'),
    },
    proxy: {
      '/web4': {
        target: 'https://localhost:3000',
        secure: false,
        changeOrigin: true,
        ws: true, // Enable WebSocket proxy
        configure: (proxy, options) => {
          // Add error logging
          proxy.on('error', (err, req, res) => {
            console.error('proxy error', err);
          });

          proxy.on('proxyReq', (proxyReq, req, res, options) => {
            // Ensure proper host header
            proxyReq.setHeader('Host', 'every.near.page');

            console.log('Outgoing cookies:', req.headers.cookie);
          });

          proxy.on('proxyRes', (proxyRes, req, res) => {

            console.log('Incoming cookies:', proxyRes.headers['set-cookie']);

            if (proxyRes.headers['set-cookie']) {
              proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie'].map(cookie =>
                cookie.replace('Secure;', 'Secure; SameSite=None;')
              );
            }

            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,HEAD,PUT,PATCH,POST,DELETE';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
            proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
          });
        },
        headers: {
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true'
        }
      }
    }
  }
});
