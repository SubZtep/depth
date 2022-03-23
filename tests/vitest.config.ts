import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    root: "../../",
    watch: false,
    reporters: "verbose",
  },
})
