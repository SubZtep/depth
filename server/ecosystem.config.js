module.exports = {
  app: [
    {
      name: "depth-wss",
      script: "./dist/index.js",
      instances: "max",
      exec_mode: "cluster",
      watch: "dist",
      watch_delay: 1000,
      kill_timeout: 3000,
      env: {
        PORT: "1337",
        NODE_ENV: "production",
      },
    },
  ],
}
