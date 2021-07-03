import type { Plugin } from "vue"
import Stats from "stats.js"

export default {
  install(app) {
    const stats = new Stats()

    // stats.addPanel(new Stats.Panel("pose", "#fff", "#0f0"))b

    stats.showPanel(2)
    stats.dom.classList.add("stats")
    // ;(document.querySelector("#gui") ?? document.body).appendChild(stats.dom)
    document.body.appendChild(stats.dom)
    app.provide("stats", stats)
  }
} as Plugin
