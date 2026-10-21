import { defineConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
// @ts-ignore
import { batchApiPlugin } from './server/apiPlugin.js';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), batchApiPlugin() as PluginOption],
  server: {
    port: 3000,
    open: true,
    watch: {
      ignored: ['**/hero-frames/**', '**/*.zip', '**/dist/**', '**/.git/**']
    }
  },
  preview: {
    port: 3000,
    open: true
  }
});
