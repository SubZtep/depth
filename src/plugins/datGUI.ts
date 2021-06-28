import type { Plugin } from "vue"
import * as dat from "dat.gui"
import { watch } from "vue"
import { createEventHook, useCssVar, useFullscreen, useDocumentVisibility, get, set } from "@vueuse/core"
import { useGlobalState } from "../store"

const gui = new dat.GUI()
// gui.remember({})
const state = useGlobalState()
const visibility = useDocumentVisibility()

watch(visibility, (current, previous) => {
  if (current === "hidden" && previous === "visible") {
    console.log("bye for now", gui.__folders)
  }
})

function addPreferences(gui: dat.GUI) {
  const hook = createEventHook<GUIEvent.Preferences>()
  const { toggle } = useFullscreen()
  const pref = {
    guiScale: 1.5,
    skybox: 14,
    toggle,
  }
  const guiScaleCss = useCssVar("--gui-scale")
  set(guiScaleCss, String(pref.guiScale))
  const f = gui.addFolder("Preferences")
  f.add(pref, "guiScale", 0.5, 3.5, 0.1).onFinishChange(scale => set(guiScaleCss, String(scale))).name("GUI Scale Size")
  f.add(pref, "skybox", 1, 15, 1)
    .onFinishChange(skybox => hook.trigger({ skybox }))
    .name("Sky Time")
  f.add(pref, "toggle").name("Toggle Fullscreen")
  return hook
}

function addCameraControl(gui: dat.GUI) {
  const hook = createEventHook<GUIEvent.Camera>()
  const btns = {
    rotate: () => hook.trigger({ cmd: "rotate" }),
    shake: () => hook.trigger({ cmd: "shake" }),
  }

  const f = gui.addFolder("InGame Camera Control")
  f.add(btns, "rotate").name("Rotate")
  f.add(btns, "shake").name("Shake")
  // f.add(get(state), "cameraZoomToPile").name("✯ zoom to pile")
  return hook
}

export default {
  install(app) {
    app.provide("gui", gui)
    app.provide("cameraHook", addCameraControl(gui))
    app.provide("preferencesHook", addPreferences(gui))
  },
} as Plugin
