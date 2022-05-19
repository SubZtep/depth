import { defineConfig } from "vite"
// import comlink from "vite-plugin-comlink"
// import comlink from "comlink"
// import worker, { pluginHelper } from "vite-plugin-worker"
// import Pug from "vite-plugin-pug"
// import Pug from "./pug/index"

export default defineConfig(({ command }) => {
  return {
    mode: command === "build" ? "production" : "development",
    // resolve: {
    //   alias: {
    //     "~/": `${resolve(import.meta.url, "src")}/`,
    //   },
    // },
    plugins: [
      // comlink(),
      // pluginHelper(),
      // worker({}),
      // Pug(),
    ],
    // optimizeDeps: {
    //   exclude: [
    //     "@depth-lib/loop",
    //     "@depth-lib/statem",
    //     "@depth-lib/template",
    //     "@depth-wc/css3d-cube",
    //     "@depth-wc/statem-debug",
    //     "@depth-wc/svg-icon"
    //   ]
    // },
    build: {
      // chunkSizeWarningLimit: 1024,
      // target: ["edge90", "chrome90", "firefox90", "safari15"], // for top-level await
      // rollupOptions: {
      //   input: {
      //     main: resolve(__dirname, "index.html"),
      //     // nested: resolve(__dirname, "nested/index.html"),
      //   },
      // },
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
    },
    server: {
      //   fs: {
      //     allow: [".."],
      //   },
      // https: true,
    },
  }
})
