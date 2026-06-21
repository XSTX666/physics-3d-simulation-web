import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'ui': ['react', 'react-dom']
        }
      }
    }
  },
  define: {
    __VERSION__: JSON.stringify('1.0.0')
  }
})
