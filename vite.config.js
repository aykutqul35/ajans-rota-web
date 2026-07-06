import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'vendor-framer-motion';
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router') || id.includes('scheduler')) return 'vendor-react';
            if (id.includes('recharts')) return 'vendor-recharts';
            if (id.includes('@clerk')) return 'vendor-clerk';
            if (id.includes('html2pdf')) return 'vendor-html2pdf';
            if (id.includes('@remix-run') || id.includes('@radix-ui')) return 'vendor-ui';
            
            // For other node_modules, create separate chunks based on the package name
            const packageName = id.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
            if (packageName && packageName[1]) {
              return `npm.${packageName[1].replace('@', '')}`;
            }
            return 'vendor';
          }
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true
      }
    }
  }
})
