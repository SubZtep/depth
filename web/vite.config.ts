import { resolve } from "node:path"
import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import Components from "unplugin-vue-components/vite"
import CrossOriginIsolation from "vite-plugin-cross-origin-isolation"
// import { VitePWA } from "vite-plugin-pwa"
import AutoImport from "unplugin-auto-import/vite"
import WindiCSS from "vite-plugin-windicss"

export default defineConfig(({ command }) => {
  const isDev = command === "serve"
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
      // VitePWA(),
      Components({
        dts: "src/types/components.d.ts",
        dirs: [
          // "src/components/ui",
          // "src/components/3d",
          // "src/3d/components",
          // "src/components/panel",
          // "src/components/_poser",
          // "src/components/_server",
          "src/components",
        ],
        extensions: ["vue", "ts"],
        // deep: false,
        deep: true,
      }),
      AutoImport({
        // FIXME: https://github.com/antfu/unplugin-auto-import/issues/33
        include: [/\.[jt]s$/, /\.vue\??/],
        exclude: [/node_modules/, /__test__/, /\.d\.ts$/],
        imports: [
          {
            vue: [
              "ref",
              "inject",
              "shallowRef",
              "toRef",
              "toRefs",
              "reactive",
              "computed",
              "watch",
              "watchEffect",
              "watchPostEffect",
              "defineComponent",
              "onMounted",
              "onBeforeUnmount",
              "getCurrentInstance",
              "onScopeDispose",
            ],
          },
          {
            "@vueuse/core": ["get", "set", "and", "whenever"],
          },
          { "@vueuse/integrations": ["useNProgress"] },
          // { "three/src/core/Object3D": ["Object3D"] },
          // { "three/src/math/Vector3": ["Vector3"] },
          // { three: ["* as THREE"] },
          { "vue-toastification": ["useToast"] },
          { "@depth/hud": ["addGuiFolder"] },
        ],
        dts: "src/types/auto-imports.d.ts",
      }),
      WindiCSS(),
      CrossOriginIsolation(),
    ],
    build: {
      sourcemap: isDev,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1_666,
      rollupOptions: {
        manualChunks: {
          depth: ["./src/pages/DepthPage.vue"],
          environment: ["./src/pages/EnvironmentPage.vue"],
          video: ["./src/pages/VideoPage.vue"],
          // "group-hands": ["./src/components/player/PlayerHands.vue"],
          // "LogarithmicShell": ["./src/components/3d/LogarithmicShell.vue"],
          // "HeatmapTerrain": ["./src/components/3d/HeatmapTerrain.vue"],
        },
        output: {
          sourcemap: isDev,
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
      // https: true,
    },
  }
})
