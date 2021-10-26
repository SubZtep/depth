/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = {
  name: "depth",
  script: "serve",
  watch: true,
  cwd: require("path").join(__dirname, "web/dist"),
  env: {
    PM2_SERVER_PATH: ".",
    PM2_SERVE_PORT: 6669,
  },
}
