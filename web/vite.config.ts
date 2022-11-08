import { defineConfig } from "vite"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
// import Pug from "vite-plugin-pug"

const __dirname = dirname(fileURLToPath(new URL(import.meta.url)))

export default defineConfig(({ command }) => {
  const isProd = command === "build"
  return {
    mode: isProd ? "production" : "development",
    // plugins: [Pug()],
    base: "./",
    build: {
      target: "esnext",
      chunkSizeWarningLimit: 1024,
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          test: resolve(__dirname, "src/pages/test.html"),
          physics: resolve(__dirname, "src/pages/physics.html")
        },
        output: {
          sourcemap: !isProd
          // manualChunks(id: string) {
          //   if (id.includes("three")) {
          //     return "three"
          //   }
          // },
        }
      }
    }
    // server: {
    //   https: false
    // }
  }
})
