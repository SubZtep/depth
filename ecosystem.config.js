// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require("path")

module.exports = {
  name: "depth",
  script: "serve",
  cwd: join(__dirname, "dist"),
  env: {
    PM2_SERVER_PATH: ".",
    PM2_SERVE_PORT: 6669,
  },
}
