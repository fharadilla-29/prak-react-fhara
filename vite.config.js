import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        latihan4: './latihan-4.html',
        latihan7: './latihan-7.html',
        pertemuan5: './pertemuan-5.html',
      }
    }
  }
})
