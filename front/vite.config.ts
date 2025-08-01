import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  build: {
    outDir: '../back/public', // 直接输出到后端public目录
    emptyOutDir: true
  }
})
=======
})
>>>>>>> parent of 450feb9 (准备部署工作)
