// import legacy from "@vitejs/plugin-legacy"; not supported library mode yet
import reactRefresh from "@vitejs/plugin-react-refresh";
import react from "@vitejs/plugin-react-swc";

import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, loadEnv } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    build: {
      lib: {
        entry: path.resolve(__dirname, "src/cray-widget/index.tsx"),
        name: "dd-react",
        fileName: format => `index.${format}.js`,
      },
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: ["react"],
        output: {
          // Provide global variables to use in the UMD build
          // for externalized deps
          globals: {
            react: "React",
          },
        },
      },
    },
    plugins: [
      react(),
      createHtmlPlugin({
        inject: { data: Object.assign({ mode }, process.env) },
      }),
    ],
    esbuild: {
      jsxInject: `import React from 'react'`, // automatically import React in jsx files
    },
    resolve: {
      alias: {
        // for TypeScript path alias import like : @/x/y/z
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:8080",
          secure: false,
          rewrite: path => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
