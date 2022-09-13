import { defineConfig } from "vite"
import { resolve } from "node:path"
import Pug from "vite-plugin-pug"

export default defineConfig(({ command }) => {
  const isProd = command === "build" // FIXME: is it?
  return {
    mode: isProd ? "production" : "development",
    plugins: [Pug()],
    base: "./",
    build: {
      target: "esnext",
      chunkSizeWarningLimit: 1024,
      rollupOptions: {
        input: {
          main: resolve("./index.html"),
          test: resolve("./pages/test.html"),
          physics: resolve("./src/pages/physics.html"),
        },
        output: {
          sourcemap: !isProd,
          // manualChunks(id: string) {
          //   if (id.includes("three")) {
          //     return "three"
          //   }
          // },
        },
      },
    },
    server: {
      https: false,
    },
  }
})
