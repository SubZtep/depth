import type { Plugin } from "vite"
// import chalk from "chalk"

export default function (): Plugin {
  return {
    name: "enable-shared-array-buffer",

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // if (req.url?.toLowerCase().indexOf("ffmpeg") !== -1) {
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp")
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin")
        //   server.config.logger.info(chalk`{redBright ${req.url}:} {cyan SharedArrayBuffer enabled}`)
        // }
        next()
      })
    },
  }
}
