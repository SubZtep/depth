import type { Plugin } from "vite"
import chalk from "chalk"

export default function (): Plugin {
  return {
    name: "enable-shared-array-buffer",

    configureServer(server) {
      server.middlewares.use((_req, res, next) => {
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp")
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin")
        server.config.logger.info(chalk`{redBright Enabled for Chrome:} {cyan SharedArrayBuffer}`)
        next()
      })
    },
  }
}
