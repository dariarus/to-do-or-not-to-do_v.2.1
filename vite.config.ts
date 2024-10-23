import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [
    react({
      tsDecorators: true
    }),
  ],
  base: "/todo-or-not-todo-v2/",
  server: {
    host: 'localhost',
    port: 3000
  }
})
