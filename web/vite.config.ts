import path from "node:path"
import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import Components from "unplugin-vue-components/vite"
import CrossOriginIsolation from "vite-plugin-cross-origin-isolation"
import { VitePWA } from "vite-plugin-pwa"
import AutoImport from "unplugin-auto-import/vite"
import WindiCSS from "vite-plugin-windicss"

export default defineConfig(({ command }) => {
  return {
    mode: command === "build" ? "production" : "development",
    resolve: {
      alias: {
        "~/": `${path.resolve("./src")}/`,
      },
    },
    plugins: [
      Vue(),
      VitePWA(),
      Components({
        dts: "src/types/components.d.ts",
        // dirs: ["src/components/ui", "src/components/3D", "src/3D/components"],
        dirs: ["src/components/ui", "src/components/3d"],
        extensions: ["vue", "ts"],
        deep: false,
      }),
      AutoImport({
        // FIXME: https://github.com/antfu/unplugin-auto-import/issues/33
        include: [/\.[jt]s$/, /\.vue\??/],
        exclude: [/node_modules/, /__test__/, /\.d\.ts$/],
        imports: [
          {
            vue: ["ref", "reactive", "computed", "watch", "defineComponent", "onMounted", "onBeforeUnmount"],
          },
          {
            "@vueuse/core": [
              //     "biSyncRef",
              //     "syncRef",
              //     "useCssVar",
              //     "useDevicesList",
              //     "useEventListener",
              //     "useFullscreen",
              //     "useIntervalFn",
              //     "useMagicKeys",
              //     "useMediaControls",
              //     "useTimeout",
              //     "useTimeoutFn",
              //     "useUserMedia",
              //     "tryOnMounted",
              //     "tryOnUnmounted",
              //     "tryOnBeforeUnmount",
              //     "watchWithFilter",
              //     "whenever",
              "get",
              "set",
              //     "and",
              //     "not",
              //     "invoke",
            ],
          },
          { "@vueuse/integrations": ["useNProgress"] },
          { "vue-toastification": ["useToast"] },
          // { pinia: ["storeToRefs"] },
          // TODO: auto import like this: { "@depth/dat.gui": ["addGuiFolder"] },
        ],
        dts: "src/types/auto-imports.d.ts",
      }),
      WindiCSS(),
      CrossOriginIsolation(),
      // {
      //   name: "vite-plugin-build-skip-public-dirs",
      //   apply: "build",
      //   // TODO: skip public/libs dir
      // },
    ],
    build: {
      sourcemap: true,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1_666,
      rollupOptions: {
        manualChunks: {
          "group-hands": ["./src/components/player/PlayerHands.vue"],
        },
        output: {
          sourcemap: true,
          manualChunks(id: string) {
            if (id.includes("three")) {
              return "three"
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
  }
})
