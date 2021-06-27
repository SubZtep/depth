import type { Plugin } from "vue"
import Stats from "stats.js"

export default {
  install(app) {
    const stats = new Stats()
    stats.showPanel(2)
    stats.dom.classList.add("stats")
    // document.body.prepend(stats.dom)
    document.body.appendChild(stats.dom)
    app.provide("stats", stats)
  }
} as Plugin