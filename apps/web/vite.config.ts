import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/generate-bill-pdf': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/generate-order-receipt': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@kanchan/shared': path.resolve(__dirname, '../../packages/shared'),
      '@kanchan/types': path.resolve(__dirname, '../../packages/types'),
      '@kanchan/utils': path.resolve(__dirname, '../../packages/utils'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});