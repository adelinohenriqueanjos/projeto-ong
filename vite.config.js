import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: '.',
    publicDir: 'assets',

    build: {
        outDir: 'dist',
        emptyOutDir: true,
        minify: 'esbuild',
        cssMinify: true,
        sourcemap: false,

        rollupOptions: {
            input: {
                index:    resolve(__dirname, 'index.html'),
                quemSomos: resolve(__dirname, 'quem-somos.html'),
                projetos: resolve(__dirname, 'projetos.html'),
                impacto:  resolve(__dirname, 'impacto.html'),
                cadastro: resolve(__dirname, 'cadastro.html'),
                obrigado: resolve(__dirname, 'obrigado.html')
            }
        }
    },

    server: {
        port: 3000,
        open: true
    }
});