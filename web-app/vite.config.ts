import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'wasp/client/operations': '/src/client/context/operationsMock.ts',
      'wasp/client/auth': '/src/client/context/authMock.ts'
    }
  },
  build: {
    outDir: 'build'
  }
});
