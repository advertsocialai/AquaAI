import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt"],
      manifest: {
        name: "AquaI — Aquaculture Intelligence",
        short_name: "AquaI",
        description:
          "India's AI-powered aquaculture intelligence platform — live pricing, diagnostics, marketplace, logistics, advisory.",
        theme_color: "#0B5394",
        background_color: "#000000",
        display: "standalone",
        orientation: "portrait",
        start_url: "/aquaai",
        scope: "/",
        lang: "en",
        categories: ["productivity", "business", "agriculture"],
        icons: [
          { src: "/favicon.ico", sizes: "64x64",   type: "image/x-icon" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,jpg,jpeg,woff,woff2}"],
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            // Cache-first for static assets.
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|woff|woff2)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "aquai-assets",
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            // Network-first for API; falls back to cache when offline.
            urlPattern: /\/api\/v1\//,
            handler: "NetworkFirst",
            options: {
              cacheName: "aquai-api",
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 10 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          react:      ["react", "react-dom", "react-router-dom"],
          framer:     ["framer-motion"],
          charts:     ["recharts"],
          maps:       ["leaflet"],
          icons:      ["lucide-react"],
          i18n:       ["i18next", "react-i18next", "i18next-browser-languagedetector"],
          tanstack:   ["@tanstack/react-query"],
        },
      },
    },
  },
}));
