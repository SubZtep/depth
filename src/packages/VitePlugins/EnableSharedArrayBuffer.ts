import type { Plugin } from "vite"
import chalk from "chalk"

export default function (filterOutExtensions = ["jpg", "png", "map", "css", "postcss", "webm", "mp4", "dds", "svg"]): Plugin {
  return {
    name: "enable-shared-array-buffer",

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const ext = req.url?.split(".").pop()?.split("?").shift() ?? ""
        if (!filterOutExtensions.includes(ext)) {
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp")
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin")
          server.config.logger.info(chalk`{redBright ${req.url}:} {cyan SharedArrayBuffer enabled}`)
        }
        next()
      })
    },
  }
}
