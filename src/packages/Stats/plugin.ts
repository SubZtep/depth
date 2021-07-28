import type { Plugin, InjectionKey } from "vue"
import Stats from "stats.js"
import "./style.css"

const statsKey: InjectionKey<Stats> = Symbol("stats panel")
const stats = new Stats()
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
    app.provide(statsKey, stats)
  },
} as Plugin

export function useStats(opt?: { mosaic?: boolean }) {
  const s = inject<Stats>(statsKey)!
  if (opt?.mosaic !== undefined) {
    s.dom.classList[opt.mosaic ? "add" : "remove"]("mosaic")
  }
  return s
}
