import type { Plugin } from "vue"
import Stats from "stats.js"
import "./style.css"

const statsKey = Symbol("stats panel")
const stats = new Stats()
stats.dom.classList.add("Stats")
document.body.appendChild(stats.dom)

export default {
  install(app, options?: StatsOptions) {
    // TODO: mosaic view
    if (options?.showPanel !== undefined) {
      stats.showPanel(options.showPanel)
    }
    app.provide(statsKey, stats)
  }
} as Plugin

export function useStats() {
  return inject<Stats>(statsKey)!
}
