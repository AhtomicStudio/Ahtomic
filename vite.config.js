import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // Predictable filename for scripts/prerender.mjs to import directly —
    // otherwise Vite's default naming for the SSR entry isn't guaranteed.
    ...(isSsrBuild
      ? { rollupOptions: { output: { entryFileNames: "entry-server.js" } } }
      : {}),
  },
}));
