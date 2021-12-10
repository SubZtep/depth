import { resolve } from "node:path"
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
        // eslint-disable-next-line unicorn/prefer-module
        "~/": `${resolve(__dirname, "src")}/`,
      },
    },
    plugins: [
      Vue(),
      VitePWA(),
      Components({
        dts: "src/types/components.d.ts",
        dirs: ["src/components/ui"],
        extensions: ["vue", "ts"],
        deep: false,
      }),
      AutoImport({
        // FIXME: https://github.com/antfu/unplugin-auto-import/issues/33
        include: [/\.[jt]s$/, /\.vue\??/],
        exclude: [/node_modules/, /__test__/, /\.d\.ts$/],
        imports: [
          {
            vue: [
              "ref",
              "toRef",
              "reactive",
              "computed",
              "watch",
              "defineComponent",
              "onMounted",
              "onBeforeUnmount",
              "getCurrentInstance",
            ],
          },
          {
            "@vueuse/core": ["get", "set"],
          },
          { "@vueuse/integrations": ["useNProgress"] },
          { "vue-toastification": ["useToast"] },
          { "@depth/hud": ["addGuiFolder"] },
          // { pinia: ["storeToRefs"] },
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
