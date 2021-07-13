import type { Plugin } from "vue"
import type { EventHook } from "@vueuse/core"
import dat from "dat.gui"
import { inject } from "vue"
import { createEventHook, useCssVar, useFullscreen, set } from "@vueuse/core"
import "./extend"
import "./style.css"

const guiKey = Symbol("dat.gui")
const cameraHookKey = Symbol("camera hook")

const gui = new dat.GUI({ closed: false, width: 420 })
gui.hide()
// gui.remember({})

function addPreferences(gui: dat.GUI, options?: GuiOptions) {
  const { toggle } = useFullscreen()
  const pref = {
    guiScale: 1.2,
    toggle,
  }
  const guiScaleCss = useCssVar("--gui-scale")
  set(guiScaleCss, String(pref.guiScale))
  const f = gui.addFolder("Preferences")
  f.add(pref, "guiScale", 0.5, 3.5, 0.1).onFinishChange(scale => set(guiScaleCss, String(scale))).name("GUI scale pc.")
  f.add(pref, "toggle").name("Toggle fullscreen")
}

function addCameraControl(gui: dat.GUI, routes?: Route[]) {
  const hook = createEventHook<GUIEvent.Camera>() // TODO: what's this hook for?
  const btns = {
    rotate: () => hook.trigger({ cmd: "rotate" }),
    shake: () => hook.trigger({ cmd: "shake" }),
  }

  if (routes) {
    const f = gui.addFolder("Navigation")
    routes.forEach(({ path, label }) => {
      const name = path.substring(1)
      btns[name] = () => window.location.hash = path
      f.add(btns, name).name(`⚓ ${label}`)
    })
    // f.open()
  }

  return hook
}

export default {
  install(app, options?: GuiOptions) {
    app.provide(guiKey, gui)
    app.provide(cameraHookKey, addCameraControl(gui, options?.routes))
    addPreferences(gui)
  },
} as Plugin

export function useGui() {
  return inject<dat.GUI>(guiKey)!
}

export function useOnCameraEvent(cb: (params: GUIEvent.Camera) => void) {
  inject<EventHook<GUIEvent.Camera>>(cameraHookKey)!.on(cb)
}
