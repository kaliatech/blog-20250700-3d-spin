import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2900,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('babylonjs')) {
              return 'vendor_babylonjs'
            }
            return 'vendor'
          }
        },
      },
    },
  },
})
