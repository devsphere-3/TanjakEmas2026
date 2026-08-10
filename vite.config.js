import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // appType: 'spa' adalah default Vite — semua route fallback ke index.html
  // baik saat `npm run dev` maupun `npm run preview`
});
