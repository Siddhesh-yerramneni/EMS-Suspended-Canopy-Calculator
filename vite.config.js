import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Ensure relative asset URLs for WordPress plugin paths
  base: './',
  build: {
    outDir: 'dist-ems',        // NEW: separate folder for your v2 plugin
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Stable entry filename your PHP enqueues
        entryFileNames: 'assets/canopy-calculator-ems.js',
        // Force Tailwind bundle to a stable name for Shadow DOM fetch
        assetFileNames: (asset) => {
          if (asset.name && asset.name.endsWith('.css')) {
            return 'assets/canopy-calculator-ems.css'
          }
          return 'assets/[name]-[hash][extname]'
        },
        chunkFileNames: 'assets/[name]-[hash].js',
      },
    },
    // Optional: add manifest if you ever want to read it from PHP later
    // manifest: true,
  },
  server: {
    proxy: {
      // existing WP Engine proxy (unchanged)
      '/api': {
        target: 'https://engexpstaging.wpengine.com',
        changeOrigin: true,
        secure: true, // WP Engine has valid cert
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            proxyReq.setHeader('accept', 'application/json');
            console.log('[wpengine proxyReq]', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('[wpengine proxyRes]', proxyRes.statusCode, proxyRes.headers['content-type']);
            const status = proxyRes.statusCode || 0;
            if ([301, 302, 307, 308].includes(status)) {
              const loc = proxyRes.headers['location'];
              if (loc) {
                try {
                  if (loc.startsWith('/')) {
                    proxyRes.headers['location'] = '/api' + loc;
                  } else if (loc.startsWith('https://engexpstaging.wpengine.com')) {
                    const u = new URL(loc);
                    proxyRes.headers['location'] = '/api' + u.pathname + (u.search || '');
                  }
                } catch { }
              }
            }
          });
        }
      },

      // NEW: proxy to api2.engineeringexpress.com for canopy calculator
      '/canopy-api': {
        target: 'https://api2.engineeringexpress.com',
        changeOrigin: true,
        /**
         * CERT IS INVALID on the upstream — disable only in DEV.
         * When the cert is fixed, flip this back to true.
         */
        secure: false,
        // keep the path and query; just strip the /canopy-api prefix
        rewrite: (path) => path.replace(/^\/canopy-api/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            proxyReq.setHeader('accept', 'application/json');
            console.log('[canopy proxyReq]', req.method, req.url);
            // proxyReq.setHeader('authorization', `Bearer ${process.env.VITE_API_TOKEN}`);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('[canopy proxyRes]', proxyRes.statusCode, proxyRes.headers['content-type']);
          });
        }
      },
    },
  },

})
