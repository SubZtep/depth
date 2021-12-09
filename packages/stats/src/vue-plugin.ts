import { effectScope, Plugin, Ref } from "vue"
import { getCurrentInstance, watch } from "vue"
import { loop3D } from "@depth/canvas"
import Stats from "stats.js"
import "./style.css"

type Fn = () => void

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

  visible?: Ref<boolean>
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

  if (options.visible !== undefined) {
    const scope = effectScope()
    scope.run(() => {
      let stopStats: Fn
      watch(
        options.visible!,
        visible => {
          visible ? (stopStats = loop3D(() => stats.update())) : stopStats?.()
          stats.dom.classList.toggle("hidden", !visible)
        },
        { immediate: true }
      )
    })
  }
}
