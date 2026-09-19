import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

// Vite configuration
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: {
    target: 'esnext',
  },
  build: {
    target: 'esnext',
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
  },
});
