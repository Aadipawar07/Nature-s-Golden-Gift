import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const authAlias =
  process.env.VITE_E2E_FAKE_AUTH === 'true'
    ? [
        {
          find: /^\.\.\/lib\/auth$/,
          replacement: fileURLToPath(
            new URL('./src/lib/auth.e2e.js', import.meta.url),
          ),
        },
      ]
    : [];

export default defineConfig({
  plugins: [react()],
  envDir: process.env.NGG_DISABLE_DOTENV === 'true' ? false : undefined,
  resolve: { alias: authAlias },
  build: {
    manifest: true,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'router',
              test: /node_modules[\\/]react-router(?:-dom)?[\\/]/,
            },
          ],
        },
      },
    },
  },
});
