import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    outDir: '../back/public', // 直接输出到后端public目录
    emptyOutDir: true
  }
})


