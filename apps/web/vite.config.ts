import { devtools } from "@tanstack/devtools-vite";
import { defineConfig, loadEnv } from "vite";
import { fileURLToPath } from "node:url";

import { tanstackRouter } from "@tanstack/router-plugin/vite";

import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";

const config = defineConfig(({ mode }) => {
  const env = loadEnv(mode, fileURLToPath(new URL(".", import.meta.url)), "");
  return {
    server: {
      proxy: env.VITE_API_URL
        ? {
            "/api/v1": {
              target: env.VITE_API_URL,
              changeOrigin: true,
            },
          }
        : undefined,
    },
    resolve: {
      tsconfigPaths: true,
      dedupe: ["react", "react-dom"],
    },
    plugins: [
      devtools(),
      tailwindcss(),
      tanstackRouter({ target: "react", autoCodeSplitting: true }),
      viteReact(),
    ],
  };
});

export default config;
