import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@\/(.*)/, replacement: path.resolve(process.cwd(), '.') + '/$1' }
    ]
  },
  // 👇 여기가 중요합니다! 저장소 이름 앞뒤로 슬래시(/)가 있어야 해요.
  base: '/',
})