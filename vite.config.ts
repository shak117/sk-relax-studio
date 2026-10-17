import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
