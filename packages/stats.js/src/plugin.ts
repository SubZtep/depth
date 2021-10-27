import type { Plugin } from "vue"
import { inject } from "vue"
import Stats from "stats.js"
import "./style.css"

export interface PluginOptions {
  /**
   * Fall back to base Stats.js settings:\
   * 0: fps, 1: ms, 2: mb, 3+: custom
   */
  showPanel?: number
  /** Display all panels */
  mosaic?: boolean
}

const statsKey = Symbol("stats panel")
const stats = new Stats()
stats.dom.removeAttribute("style")
stats.dom.classList.add("Stats")
stats.dom.addEventListener("dblclick", () => stats.dom.classList.toggle("mosaic"))
document.body.appendChild(stats.dom)

export const StatsPlugin: Plugin = function (app, options: PluginOptions = {}) {
  if (options.showPanel) {
    stats.showPanel(options.showPanel)
  }
  if (options.mosaic) {
    stats.dom.classList.add("mosaic")
  }
}

export function useStats(options?: { mosaic?: boolean }) {
  const s = inject<Stats>(statsKey)!
  if (options?.mosaic !== undefined) {
    stats.dom.classList[options.mosaic ? "add" : "remove"]("mosaic")
    s.dom.classList[options.mosaic ? "add" : "remove"]("mosaic")
  }

  return stats
}
