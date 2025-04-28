import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // root: path.resolve(__dirname, 'src'), // <-- говорим Vite, что src/ — корень проекта
  base: '/',
  publicDir: path.resolve(__dirname, 'public'),
  build: {
    outDir: path.resolve(__dirname, 'dist'), // куда класть собранный проект
    emptyOutDir: true,
    assetsDir: 'assets'
  },
  server: {
    port: 5173,
    open: true,
    https: {
      key: './certs/localhost-key.pem',
      cert: './certs/localhost.pem',
    },
  },
  preview: {
    https: {
      key: './certs/localhost-key.pem',
      cert: './certs/localhost.pem',
    },
    port: 4173,
  },
});

