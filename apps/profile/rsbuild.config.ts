import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  server: {
    port: 5170,
    base: process.env.NODE_ENV === 'production'
    ? 'https://unpkg.com/@near-everything/profile@latest/dist/'
    : '/'
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'profile',
      filename: 'profile/remoteEntry.js',
      exposes: {
        './App': './src/App.jsx'
      },
      experiments: {
        federationRuntime: 'hoisted'
      },
      // getPublicPath: `function() { console.log("look " + window.navigator.cdn_host); return "https:" + window.navigator.cdn_host + "/dist/"}`,
      shared: {
        'react': { singleton: true, eager: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, eager: true, requiredVersion: '^18.0.0' }
      },
    }),
  ]
});
