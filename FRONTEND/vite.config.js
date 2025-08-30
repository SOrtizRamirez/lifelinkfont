// vite.config.js
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        info: resolve(__dirname, 'info.html'),
        signup: resolve(__dirname, 'signup.html'),
        qr: resolve(__dirname, 'qr.html'),
      },
    },
  },
})
