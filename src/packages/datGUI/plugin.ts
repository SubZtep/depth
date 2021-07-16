import type { Plugin } from "vue"
import type { EventHook } from "@vueuse/core"
import dat from "dat.gui"
import { inject, computed } from "vue"
import { get, createEventHook, useCssVar, toRefs, syncRef } from "@vueuse/core"
import { useGlobalState } from "../../store"
import "./extend"
import "./style.css"

const state = useGlobalState()
const { guiScale } = toRefs(state)
const guiScaleCss = useCssVar("--gui-scale")
syncRef(
  computed(() => String(get(guiScale))),
  guiScaleCss
)

const guiKey = Symbol("dat.gui")
const cameraHookKey = Symbol("camera hook")

const gui = new dat.GUI({ closed: false, width: 420 })
gui.hide()

function addCameraControl(gui: dat.GUI, routes?: Route[]) {
  const hook = createEventHook<GUIEvent.Camera>() // TODO: what's this hook for?
  const btns = {
    rotate: () => hook.trigger({ cmd: "rotate" }),
    shake: () => hook.trigger({ cmd: "shake" }),
  }

  if (routes) {
    const f = gui.addFolder("⚓ Navigation")
    routes.forEach(({ path, label }) => {
      const name = path.substring(1)
      btns[name] = () => (window.location.hash = path)
      f.add(btns, name).name(label)
    })
    f.open()
  }

  return hook
}

export default {
  install(app, options?: GuiOptions) {
    app.provide(guiKey, gui)
    app.provide(cameraHookKey, addCameraControl(gui, options?.routes))
  },
} as Plugin

export function useGui() {
  return inject<dat.GUI>(guiKey)!
}

export function useOnCameraEvent(cb: (params: GUIEvent.Camera) => void) {
  inject<EventHook<GUIEvent.Camera>>(cameraHookKey)!.on(cb)
}
