import path from "path"
import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import Components from "unplugin-vue-components/vite"
import CrossOriginIsolation from "vite-plugin-cross-origin-isolation"
import AutoImport from "unplugin-auto-import/vite"
import WindiCSS from "vite-plugin-windicss"
import { ViteToml } from "vite-plugin-toml"
import type { BuildOptions } from "vite"

export default defineConfig(({ mode, command }) => {
  let build: BuildOptions = {
    sourcemap: true,
  }

  if (mode === "production" && command === "build") {
    build = {
      sourcemap: false,
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
    }
  }

  return {
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
      Vue(),
      Components({
        dirs: ["src/components"],
        extensions: ["vue", "ts"],
        dts: "src/types/components.d.ts",
        deep: true,
      }),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue\??/, // .vue
        ],
        imports: [
          "vue",
          "@vueuse/core",
          { "@vueuse/core": ["get", "set", "and", "not", "invoke"] },
          { "@vueuse/integrations": ["useNProgress"] },
          { "vue-toastification": ["useToast"] }
        ],
        dts: "src/types/auto-imports.d.ts",
      }),
      WindiCSS(),
      CrossOriginIsolation(),
    ],
    build,
    server: {
      fs: {
        allow: [".."],
      },
    },
  }
})
