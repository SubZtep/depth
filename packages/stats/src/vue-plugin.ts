import type { Plugin } from "vue"
import { getCurrentInstance } from "vue"
import Stats from "stats.js"
import "./style.css"

interface Options {
  /**
   * Display a single panel with the associated info:\
   * `0`: fps, `1`: ms, `2`: mb, 3+: custom
   */
  showPanel?: number
  /**
   * Display all the panels next to each other.
   */
  mosaic?: boolean
}

function applyOptions(stats: Stats, options: Options) {
  if (options.showPanel !== undefined) {
    stats.showPanel(options.showPanel)
  }
  if (!!options.mosaic !== stats.dom.classList.contains("mosaic")) {
    stats.dom.classList.toggle("mosaic")
  }
}

export const StatsPlugin: Plugin = function (app, options: Options = {}) {
  const stats = new Stats()
  stats.dom.removeAttribute("style")
  stats.dom.classList.add("Stats")
  stats.dom.addEventListener("dblclick", () => stats.dom.classList.toggle("mosaic"))

  applyOptions(stats, options)
  app.config.globalProperties.$stats = stats
  document.body.append(stats.dom)
}

export function useStats(options: Options = {}) {
  const instance = getCurrentInstance()
  if (!instance) throw new Error("Not in Vue scope")

  const { $stats } = instance.appContext.app.config.globalProperties
  applyOptions($stats, options)
  return {
    stats: $stats as Stats,
  }
}
