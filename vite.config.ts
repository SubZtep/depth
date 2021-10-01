import path from "path"
import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import ViteComponents from "vite-plugin-components"
import CrossOriginIsolation from "vite-plugin-cross-origin-isolation"
import AutoImport from "unplugin-auto-import/vite"
import WindiCSS from "vite-plugin-windicss"
import { ViteToml } from "vite-plugin-toml"

export default defineConfig({
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`,
    },
  },
  plugins: [
    ViteToml({
      useBigInt: false,
      namedExports: false,
    }),
    Vue({
      include: [/\.vue$/],
    }),
    ViteComponents({
      extensions: ["vue"],
    }),
    AutoImport({
      include: [/\.ts$/, /\.vue\??/],
      imports: [
        "vue",
        "@vueuse/core",
        { "@vueuse/core": ["get", "set", "and", "not", "invoke"] },
        { "@vueuse/integrations": ["useNProgress"] },
        { "vue-toastification": ["useToast"] },
      ],
      dts: "./src/types/auto-imports.d.ts",
    }),
    WindiCSS(),
    CrossOriginIsolation(),
  ],
  build: {
    cssCodeSplit: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        sourcemap: false,
        manualChunks(id: string) {
          if (id.includes("three")) {
            return "three"
          }
          if (id.includes("fortawesome")) {
            return "fa"
          }
        },
      },
    },
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
})
