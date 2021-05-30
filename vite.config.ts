import path from "path"
import Vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"
import ViteComponents from "vite-plugin-components"

export default defineConfig({
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`,
    },
  },
  plugins: [
    Vue({
      include: [/\.vue$/],
    }),
    ViteComponents({
      extensions: ["vue"],
    }),
  ],
  server: {
    // https: true
  }
})
