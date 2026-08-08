import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Semua route yang tidak dikenali dikembalikan ke index.html (SPA fallback)
    historyApiFallback: true,
  },
});
