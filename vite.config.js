import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: { host: true },
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        departments: resolve(__dirname, 'departments.html'),
        department: resolve(__dirname, 'department.html'),
        leaders: resolve(__dirname, 'leaders.html'),
        contact: resolve(__dirname, 'contact.html')
      }
    }
  }
});
