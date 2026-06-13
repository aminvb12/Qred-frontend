import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    // proxy: {
    //   '/api': {
    //     target: 'https://qred-alb-330584852.us-east-1.elb.amazonaws.com/api',
    //     changeOrigin: true,
    //   }
    // }
  }
})
