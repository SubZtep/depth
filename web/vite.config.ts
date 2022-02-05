import { resolve } from "node:path"
import { defineConfig } from "vite"
// import WindiCSS from "vite-plugin-windicss"

export default defineConfig(({ command }) => {
  // const isDev = command === "serve"
  return {
    // mode: command === "build" ? "production" : "development",
    mode: "development",
    resolve: {
      alias: {
        // eslint-disable-next-line unicorn/prefer-module
        "~/": `${resolve(__dirname, "src")}/`,
      },
    },
    // plugins: [
    //   WindiCSS(),
    // ],
    // build: {
    //   sourcemap: isDev,
    //   cssCodeSplit: true,
    //   chunkSizeWarningLimit: 1_666,
    //   rollupOptions: {
    //     manualChunks: {
    //       depth: ["./src/pages/DepthPage.vue"],
    //       environment: ["./src/pages/EnvironmentPage.vue"],
    //       video: ["./src/pages/VideoPage.vue"],
    //       // "group-hands": ["./src/components/player/PlayerHands.vue"],
    //       // "LogarithmicShell": ["./src/components/3d/LogarithmicShell.vue"],
    //       // "HeatmapTerrain": ["./src/components/3d/HeatmapTerrain.vue"],
    //     },
    //     output: {
    //       sourcemap: isDev,
    //       manualChunks(id: string) {
    //         if (id.includes("three")) {
    //           return "three"
    //         }
    //       },
    //     },
    //   },
    // },
    // server: {
    //   fs: {
    //     allow: [".."],
    //   },
    //   // https: true,
    // },
  }
})
