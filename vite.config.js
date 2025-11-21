import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 【關鍵修改點】：這是告訴 Vite 應用程式部署到子路徑時要怎麼做
  // 必須與您的 GitHub 倉庫名稱一樣
  base: '/vue-todo-app/' 
})