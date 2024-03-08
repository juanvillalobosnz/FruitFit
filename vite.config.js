import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@public': path.resolve(__dirname, './public')
    }
  }
})
