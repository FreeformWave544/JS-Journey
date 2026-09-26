import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: './',
  build: {
        rollupOptions: {
            input: {
                index: resolve(__dirname, 'index.html'),
                club: resolve(__dirname, 'club.html'),
                calendar: resolve(__dirname, 'calendar.html')
            }
        }
    }
})
