import type { Plugin } from "vue"
import Stats from "stats.js"

export default {
  install(app) {
    const stats = new Stats()
    document.body.appendChild(stats.dom)
    app.provide("stats", stats)
  }
} as Plugin