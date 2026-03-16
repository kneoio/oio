import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 8092,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  define: {
    'import.meta.env.VITE_STREAM_BASE_URL': JSON.stringify(process.env.VITE_STREAM_BASE_URL || 'http://localhost:38798'),
    'import.meta.env.VITE_BRANDS_API_BASE_URL': JSON.stringify(process.env.VITE_BRANDS_API_BASE_URL || 'http://localhost:38798')
  }
})
