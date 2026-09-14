import { defineConfig } from 'vite';

export default defineConfig({
  // relative so the built page can be served from any path, artifact hosting included
  base: './',
  server: { host: '127.0.0.1', port: 5173 },
  build: { assetsInlineLimit: 0 },
});
