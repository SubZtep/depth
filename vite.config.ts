import path from "path"
import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import ViteComponents from "vite-plugin-components"
import ViteFonts from "vite-plugin-fonts"
// import ViteRestart from "vite-plugin-restart"
import AutoImport from "unplugin-auto-import/vite"
import WindiCSS from "vite-plugin-windicss"
import { EnableSharedArrayBuffer } from "./src/packages/VitePlugins"

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
    AutoImport({
      include: [/\.ts$/, /\.vue\??/],
      imports: [
        "vue",
        "@vueuse/core",
        { "@vueuse/core": ["get", "set", "and", "not", "invoke"] },
        // { "@vueuse/sound": ["useSound"] },
        { "@vueuse/integrations": ["useNProgress"] },
        { "vue-toastification": ["useToast"] }
      ],
      dts: "./src/types/auto-imports.d.ts",
    }),
    ViteFonts({
      google: {
        families: ["Merriweather", "Text Me One", "Hind Siliguri"],
      },
    }),
    WindiCSS(),
    // ViteRestart({
    //   reload: "**/src/**/*.*",
    //   restart: "**/src/**/*.*",
    // }),
    EnableSharedArrayBuffer(),
    // TODO: scoped styles to modules
  ],

  server: {
    fs: {
      allow: [".."],
    },
  },
})
