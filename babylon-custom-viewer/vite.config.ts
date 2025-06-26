import { defineConfig } from 'vite'
export default defineConfig({
  base: './',
  build: {
    chunkSizeWarningLimit: 1500,
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
