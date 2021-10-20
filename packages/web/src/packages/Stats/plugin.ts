import type { Plugin } from "vue"
import Stats from "stats.js"
import "./style.css"

// const statsKey: InjectionKey<Stats> = Symbol("stats panel")
const stats = new Stats()
stats.dom.removeAttribute("style")
stats.dom.classList.add("Stats")
stats.dom.addEventListener("dblclick", () => stats.dom.classList.toggle("mosaic"))
document.body.appendChild(stats.dom)

export default {
  install(app, options?: StatsOptions) {
    if (options?.showPanel !== undefined) {
      stats.showPanel(options.showPanel)
    }
    if (options?.mosaic) {
      stats.dom.classList.add("mosaic")
    }
    // app.provide(statsKey, stats)
  },
} as Plugin

export function useStats(options?: { mosaic?: boolean }) {
  // const s = inject<Stats>(statsKey)!
  if (options?.mosaic !== undefined) {
    stats.dom.classList[options.mosaic ? "add" : "remove"]("mosaic")
    // s.dom.classList[options.mosaic ? "add" : "remove"]("mosaic")
  }
  return {
    stats,
  }
}
