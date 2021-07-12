import type { Plugin } from "vue"
import type { EventHook } from "@vueuse/core"
import dat from "dat.gui"
import { inject } from "vue"
import { createEventHook, useCssVar, useFullscreen, set } from "@vueuse/core"
import "./extend"

const guiKey = Symbol("dat.gui")
const cameraHookKey = Symbol("camera hook")

const gui = new dat.GUI({ closed: false, width: 420 })
gui.hide()
// gui.remember({})

function addPreferences(gui: dat.GUI) {
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

function addCameraControl(gui: dat.GUI) {
  const hook = createEventHook<GUIEvent.Camera>()
  const btns = {
    rotate: () => hook.trigger({ cmd: "rotate" }),
    shake: () => hook.trigger({ cmd: "shake" }),
    group: () => window.location.hash = "/group",
    images: () => window.location.hash = "/images",
    frames: () => window.location.hash = "/frames",
    record: () => window.location.hash = "/record",
  }

  const f = gui.addFolder("Go places")
  f.add(btns, "group").name("⚓ To group💀ped")
  f.add(btns, "images").name("⚓ video to images")
  f.add(btns, "frames").name("⚓ Save a pose / frame of a video")
  f.add(btns, "record").name("⚓ To record")
  // f.add(btns, "rotate").name("Rotate")
  // f.add(btns, "shake").name("Shake")
  f.open()
  return hook
}

export default {
  install(app) {
    app.provide(guiKey, gui)
    app.provide(cameraHookKey, addCameraControl(gui))
    addPreferences(gui)
  },
} as Plugin

export function useGui() {
  return inject<dat.GUI>(guiKey)!
}

export function useOnCameraEvent(cb: (params: GUIEvent.Camera) => void) {
  inject<EventHook<GUIEvent.Camera>>(cameraHookKey)!.on(cb)
}
