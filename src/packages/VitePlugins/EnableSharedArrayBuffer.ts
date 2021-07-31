import type { Plugin } from "vite"
import chalk from "chalk"

export default function (): Plugin {
  return {
    name: "enable-shared-array-buffer",

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // FIXME: send only for required files
        if (!req.url?.endsWith(".jpg") && !req.url?.endsWith(".webm") && !req.url?.endsWith(".mp4")) {
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp")
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin")
          server.config.logger.info(chalk`{redBright ${req.url}:} {cyan SharedArrayBuffer enabled}`)
        }
        next()
      })
    },
  }
}
