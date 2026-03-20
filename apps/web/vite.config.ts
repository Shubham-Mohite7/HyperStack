import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      /*
       * During local development, all /api requests are proxied to the Express
       * server. This mirrors the Vercel routing configuration in vercel.json
       * so the frontend code never needs an environment-specific base URL.
       */
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
