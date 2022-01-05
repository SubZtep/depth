module.exports = {
  app: [
    {
      script: "./dist/index.js",
      instances: "max",
      exec_mode: "cluster",
      watch: "dist",
      env: {
        PORT: "1337",
        NODE_ENV: "production",
      },
    },
  ],
}
