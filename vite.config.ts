import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

const srcPath = path.resolve(__dirname, "src");

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": srcPath,
        "@app": path.resolve(srcPath, "app"),
        "@pages": path.resolve(srcPath, "pages"),
        "@widgets": path.resolve(srcPath, "widgets"),
        "@features": path.resolve(srcPath, "features"),
        "@entities": path.resolve(srcPath, "entities"),
        "@shared": path.resolve(srcPath, "shared"),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== "true",
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === "true" ? null : {},
    },
  };
});
