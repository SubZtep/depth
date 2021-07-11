import type { Plugin } from "vue"
import Stats from "stats.js"
import "./stats.css"

const statsKey = Symbol("stats panel")
const stats = new Stats()
stats.showPanel(2)
stats.dom.classList.add("stats")
document.body.appendChild(stats.dom)

export default {
  install(app) {
    app.provide(statsKey, stats)
  }
} as Plugin

export function useStats() {
  return inject<Stats>(statsKey)!
}
