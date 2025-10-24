import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'ЧистоДом - Система управления',
        short_name: 'ЧистоДом',
        description: 'Эффективное решение для управления вашим бизнесом',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'favicon/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'favicon/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'favicon/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'favicon/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        globIgnores: ['**/icons/logo.png'], // Исключаем большой логотип
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // Увеличиваем лимит до 5MB
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/.*\/socket\.io\//,
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /^https:\/\/.*cleanhouse.*\.net\/(?!.*payment).*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
      '@components': path.resolve(__dirname, './src/core/components'),
    },
  },
  server: {
    hmr: {
      overlay: false
    }
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        manualChunks: {
          // Основные библиотеки React
          'react-vendor': ['react', 'react-dom'],
          
          // Роутинг
          'router': ['react-router-dom'],
          
          // UI библиотеки
          'ui-radix': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-checkbox', 
            '@radix-ui/react-dialog',
            '@radix-ui/react-form',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-toggle',
            '@radix-ui/react-tooltip'
          ],
          
          // Иконки и утилиты
          'ui-icons': ['lucide-react', 'sonner'],
          
          // Формы и валидация
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // Анимации (большая библиотека)
          'animations': ['framer-motion'],
          
          // WebSocket
          'websocket': ['socket.io-client'],
          
          // Работа с данными
          'data': ['@tanstack/react-query', 'axios'],
          
          // Утилиты
          'utils': ['clsx', 'tailwind-merge', 'class-variance-authority', 'date-fns']
        }
      }
    }
  }
}) 