import path from "path"
import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import ViteComponents from "vite-plugin-components"
import ViteFonts from "vite-plugin-fonts"
import ViteRestart from "vite-plugin-restart"
import resolve from "@rollup/plugin-node-resolve"
import commonJS from "@rollup/plugin-commonjs"
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
    ViteRestart({
      reload: "**/src/**/*.*",
      restart: "**/src/**/*.*",
    }),
    EnableSharedArrayBuffer(),
    // TODO: scoped styles to modules
  ],

  build: {
    minify: false,
    rollupOptions: {
      // external: ["@mediapipe/pose", "@tensorflow-models/pose-detection"],
      // preserveEntrySignatures: false,
      // treeshake: true,
      plugins: [
        resolve({
          browser: true,
        }),
        commonJS({
          // requireReturnsDefault: "auto",
          // include: "node_modules/**",
        }),
      ],
      output: {
        // esModule: true,
        // exports: "default",
        esModule: true,
        // manualChunks: {
        //   pose: ["@mediapipe/pose", "@tensorflow-models/pose-detection"],
        //   // tfjs: ["@tensorflow-models/pose-detection"],
        //   // three: ["three"],
        //   three: ["three", "camera-controls"]
        // },
        // preserveModules: true,
      },
    },
  },
  server: {
    // cors: true,
    fs: {
      allow: [".."],
    },

    // cors: {
    //   allowedHeaders: [
    //     "Cross-Origin-Resource-Policy: cross-origin",
    //     "Cross-Origin-Resource-Policy: same-site"
    //   ]
    // }

    //Cross-Origin-Resource-Policy: cross-origin header. On same-site resources, set Cross-Origin-Resource-Policy: same-site header.
    // https: true,
  },
})
