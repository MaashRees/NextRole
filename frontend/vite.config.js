import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  define: {
  'import.meta.env.VITE_BACKEND_URI': JSON.stringify('__VITE_BACKEND_URI__')
  }
})