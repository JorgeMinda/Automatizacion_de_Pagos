import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import fs from 'node:fs';
import path from 'node:path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'spa-404-fallback',
      closeBundle() {
        try {
          const buildDir = path.resolve(__dirname, '../build');
          const indexHtml = path.join(buildDir, 'index.html');
          const notFoundHtml = path.join(buildDir, '404.html');
          if (fs.existsSync(indexHtml)) {
            fs.copyFileSync(indexHtml, notFoundHtml);
          }
        } catch {}
      }
    }
  ],
  envPrefix: ['VITE_', 'REACT_APP_'],
  build: {
    outDir: '../build',
    emptyOutDir: true
  }
});
