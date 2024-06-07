import { defineConfig } from 'vite'
import path from 'path'

const root = process.cwd();
export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^twist-message/,
        replacement: path.resolve(root),
      },
    ]
  }
});