import path from "node:path"
import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import Components from "unplugin-vue-components/vite"
import CrossOriginIsolation from "vite-plugin-cross-origin-isolation"
import { VitePWA } from "vite-plugin-pwa"
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
      chunkSizeWarningLimit: 1666,
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
    resolve: {
      alias: {
        // eslint-disable-next-line unicorn/prefer-module
        "~/": `${path.resolve(__dirname, "src")}/`,
      },
    },
    plugins: [
      Vue(),
      VitePWA(),
      Components({
        dirs: ["src/3D", "src/App", "src/components"],
        extensions: ["vue", "ts"],
        dts: "src/types/components.d.ts",
        deep: true,
      }),
      AutoImport({
        // FIXME: https://github.com/antfu/unplugin-auto-import/issues/33
        include: [/\.[jt]s$/, /\.vue\??/],
        exclude: [/node_modules/, /__test__/, /\.d\.ts$/],
        imports: [
          "vue",
          // "@vueuse/core",
          {
            "@vueuse/core": [
              "biSyncRef",
              "syncRef",
              "useCssVar",
              "useDevicesList",
              "useEventListener",
              "useFullscreen",
              "useIntervalFn",
              "useMagicKeys",
              "useMediaControls",
              "useTimeout",
              "useTimeoutFn",
              "useUserMedia",
              "tryOnMounted",
              "tryOnUnmounted",
              "tryOnBeforeUnmount",
              "watchWithFilter",
              "whenever",
              "get",
              "set",
              "and",
              "not",
              "invoke",
            ],
          },
          { "@vueuse/integrations": ["useNProgress"] },
          { "vue-toastification": ["useToast", "POSITION"] },
          { pinia: ["storeToRefs"] },
          // { "./src/stores/video": ["useVideoStore"] },
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
