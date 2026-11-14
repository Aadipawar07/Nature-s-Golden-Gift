import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  envDir: process.env.NGG_DISABLE_DOTENV === 'true' ? false : undefined,
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
