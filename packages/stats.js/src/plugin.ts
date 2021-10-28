import type { Plugin } from "vue"
import { inject } from "vue"
import Stats from "stats.js"

export interface PluginOptions {
  /**
   * Add an extra class to the root element.
   */
  addClass?: string
  /**
   * Fall back to base Stats.js addPanel method param:\
   * 0: fps, 1: ms, 2: mb, 3+: custom.
   */
  showPanel?: number
  /**
   * Display all panels.
   */
  mosaic?: boolean
}

const statsKey = Symbol("stats panel")

export const StatsPlugin: Plugin = function (app, { addClass, showPanel, mosaic }: PluginOptions = {}) {
  const stats = new Stats()
  if (addClass) {
    stats.dom.removeAttribute("style")
    stats.dom.classList.add(addClass)
  }
  if (mosaic) {
    stats.dom.classList.add("mosaic")
    stats.dom.addEventListener("dblclick", () => stats.dom.classList.toggle("mosaic"))
  }
  document.body.appendChild(stats.dom)
  if (showPanel !== undefined) stats.showPanel(showPanel)

  app.provide(statsKey, stats)
}

export function useStats({ mosaic }: Pick<PluginOptions, "mosaic"> = {}) {
  const stats = inject<Stats>(statsKey)!
  if (mosaic !== undefined) {
    stats.dom.classList[mosaic ? "add" : "remove"]("mosaic")
  }
  return stats
}
