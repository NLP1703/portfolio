import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
  build: {
    rollupOptions: {
      output: {
        // three.js dans son propre chunk, chargé à la demande après le premier affichage.
        // React est isolé aussi : sinon Rollup le range dans le chunk three, que l'entrée
        // devrait alors précharger.
        manualChunks: (id) => {
          if (/node_modules[\\/](three|@react-three)[\\/]/.test(id)) return 'three'
          if (/node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react'
          return undefined
        },
      },
    },
    // Le chunk three (~220 Ko gzip) dépasse le seuil par défaut, mais il n'est jamais sur le chemin critique.
    chunkSizeWarningLimit: 900,
  },
})
