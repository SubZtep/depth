import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import ViteComponents from "vite-plugin-components"
import ViteFonts from "vite-plugin-fonts"
import ViteRestart from "vite-plugin-restart"

export default defineConfig({
  plugins: [
    Vue({
      include: [/\.vue$/],
    }),
    ViteComponents({
      extensions: ["vue"],
    }),
    ViteFonts({
      google: {
        families: ["Merriweather", "Text Me One"],
      },
    }),
    ViteRestart({
      reload: "**/src/**/*.*",
      restart: "**/src/**/*.*",
    }),
  ],
  server: {
    // https: true,
  },
})
