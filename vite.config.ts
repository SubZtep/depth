import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import ViteComponents from "vite-plugin-components"
import ViteFonts from "vite-plugin-fonts"

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
        families: ["Merriweather"],
      },
    }),
  ],
  server: {
    // https: true,
  },
})
