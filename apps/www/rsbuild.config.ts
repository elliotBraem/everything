import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { defineConfig } from '@rsbuild/core';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { pluginReact } from '@rsbuild/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  html: {
    title: 'everything',
  },
  source: {
    entry: {
      index: './src/main.tsx'
    },
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: 'every.near.page',
    port: 5173,
    https: {
      key: fs.readFileSync("../../_wildcard.near.page-key.pem"),
      cert: fs.readFileSync("../../_wildcard.near.page.pem")
    },
    proxy: {
      '/web4': {
        target: 'https://localhost:3000',
        secure: false,
        changeOrigin: true,
        ws: true,
        onProxyReq: (proxyReq: any, req: any) => {
          proxyReq.setHeader('Host', 'every.near.page');
          console.log('Outgoing cookies:', req.headers.cookie);
        },
        onProxyRes: (proxyRes: any, req: any, res: any) => {
          console.log('Incoming cookies:', proxyRes.headers['set-cookie']);

          if (proxyRes.headers['set-cookie']) {
            proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie'].map(
              (cookie: string) => cookie.replace('Secure;', 'Secure; SameSite=None;')
            );
          }

          proxyRes.headers['Access-Control-Allow-Origin'] = '*';
          proxyRes.headers['Access-Control-Allow-Methods'] =
            'GET,HEAD,PUT,PATCH,POST,DELETE';
          proxyRes.headers['Access-Control-Allow-Headers'] =
            'Content-Type, Authorization';
          proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
        },
        onError: (err: Error) => {
          console.error('proxy error', err);
        },
        headers: {
          Connection: 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true'
        }
      },
      '/ai': {
        target: 'http://localhost:3005',
        changeOrigin: true
      }
    }
  },
  tools: {
    rspack: (config, { appendPlugins }) => {
      config.output!.uniqueName = 'www';
      
      appendPlugins([
        new ModuleFederationPlugin({
          name: 'www',
          filename: 'remoteEntry.js',
          remotes: {
            profile: process.env.NODE_ENV === 'production'
              ? 'https://unpkg.com/@near-everything/profile@0.0.9/dist/profile/remoteEntry.js'
              : 'http://localhost:5170/profile/remoteEntry.js',
          },
          experiments: {
            federationRuntime: 'hoisted'
          },
          remoteType: 'module',
          manifest: {
            filePath: 'manifestpath',
          },
          shared: {
            'react': { singleton: true, eager: true },
            'react-dom': { singleton: true, eager: true },
            '@tanstack/react-router': { singleton: true, eager: true }
          }
        })
      ]);
    }
  },
  plugins: [
    pluginReact({
      // Disable chunk splitting for React to ensure proper module federation
      splitChunks: {
        react: false,
        router: false
      }
    }),
    pluginNodePolyfill()
  ]
});
