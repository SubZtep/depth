import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import Components from "unplugin-vue-components/vite"
import CrossOriginIsolation from "vite-plugin-cross-origin-isolation"
import AutoImport from "unplugin-auto-import/vite"
import WindiCSS from "vite-plugin-windicss"
import type { BuildOptions } from "vite"

export default defineConfig(({ mode, command }) => {
  let build: BuildOptions = {
    sourcemap: true,
  }

  if (mode === "production" && command === "build") {
    build = {
      sourcemap: false,
      cssCodeSplit: false,
      chunkSizeWarningLimit: 1154,
      rollupOptions: {
        output: {
          sourcemap: false,
          manualChunks(id: string) {
            if (id.includes("three")) {
              return "three"
            }
          },
        },
      },
    }
  }

  return {
    plugins: [
      Vue(),
      Components({
        dirs: ["src/3D", "src/App", "src/components"],
        extensions: ["vue", "ts"],
        dts: "src/types/components.d.ts",
        deep: true,
      }),
      AutoImport({
        include: [
          /\.[tj]s$/,
          /\.vue\??/,
        ],
        imports: [
          "vue",
          "@vueuse/core",
          { "@vueuse/core": ["get", "set", "and", "not", "invoke"] },
          { "@vueuse/integrations": ["useNProgress"] },
          { "vue-toastification": ["useToast", "POSITION"] },
          { pinia: ["storeToRefs"] },
          // { "./src/stores/video": ["useVideoStore"] },
          // { "./src/misc/utils": ["basename", "sleep"] },
          // { "./src/misc/filters": ["truthyFilter"] },
          // { "./src/events": ["onVisibility"] },
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
