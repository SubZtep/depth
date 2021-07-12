import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import ViteComponents from "vite-plugin-components"
import ViteFonts from "vite-plugin-fonts"
import ViteRestart from "vite-plugin-restart"
import resolve from "rollup-plugin-node-resolve"
import commonJS from "rollup-plugin-commonjs"

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
    fs: {
      allow: [".."]
    }
    // https: true,
  },
})
