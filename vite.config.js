import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => ({
    server: {
        proxy: {
            '/api/v2': {
                target: 'https://ngw.devices.sberbank.ru:9443',
                changeOrigin: true,
                secure: false,
                configure: (proxy) => {
                    const env = loadEnv(mode, process.cwd(), '')
                    proxy.on('proxyReq', (proxyReq) => {
                        proxyReq.setHeader('Authorization', `Basic ${env.GIGA_AUTH}`);
                    });
                }
            },
            '/api/v1': {
                target: 'https://gigachat.devices.sberbank.ru',
                changeOrigin: true,
                secure: false,
            },
        },
    },
}))
