import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        proxy: {
            '/api/v2': {
                target: 'https://ngw.devices.sberbank.ru:9443',
                changeOrigin: true,
                secure: false,
            },
            '/api/v1': {
                target: 'https://gigachat.devices.sberbank.ru',
                changeOrigin: true,
                secure: false,
            },
        },
    },
})