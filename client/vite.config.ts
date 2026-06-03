import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    //Dev proxy - avoids CORS issues during local development
    proxy: {
      '/api': 
      {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    //Warn if any chunk exceeds 500kb
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        //Split vendor libs into separate chunk for better caching caching
        manualChunks(id) {
          if(id.includes('node_modules/framer-motion')) return 'motion'
          if(id.includes('node_modules')) return 'vendor'
        }
      }
    }
  }
})
