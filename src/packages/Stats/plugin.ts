import type { Plugin, InjectionKey } from "vue"
import Stats from "stats.js"
import "./style.css"

const statsKey: InjectionKey<Stats> = Symbol("stats panel")
const stats = new Stats()
stats.dom.removeAttribute("style")
stats.dom.classList.add("Stats")
stats.dom.addEventListener("dblclick", () => stats.dom.classList.toggle("mosaic"))
document.body.appendChild(stats.dom)

async function dlStats(cb: FnPr, thisArg = globalThis) {
  const t0 = performance.now()
  await cb.call(thisArg)
  const t1 = performance.now()
  // dlstat.update(t1 - t0, 33.33) // for 30fps
}

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

export function useStats(options?: { mosaic?: boolean }) {
  const s = inject<Stats>(statsKey)!
  if (options?.mosaic !== undefined) {
    s.dom.classList[options.mosaic ? "add" : "remove"]("mosaic")
  }
  return {
    stats: s,
    dlStats,
  }
}
