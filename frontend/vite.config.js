import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    // Local dev: proxy /api/* to the Express backend running on :5000
    proxy: {
      '/api': {
        target: process.env.BACKEND_URL || 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    // Ensure clean builds for Vercel
    outDir: 'dist',
    emptyOutDir: true
  }
});
