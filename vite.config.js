import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createRequire } from 'module'



// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
},
{
  server: {
    port: 3000,
    open: true,
    strictPort: true,
    hmr: {
      overlay: false,
      host: 'localhost',
      port: 3000,
    },
  },
  preview: {
    port: 3000,
    open: true,
    strictPort: true,
  },
}
)
